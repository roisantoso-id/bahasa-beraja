// 本地数据库工具类 - 支持多用户
// 使用 localStorage 和 PostgreSQL 进行数据持久化

import UserManager from './userManager';

const DB_VERSION = '1.0';

class LocalDatabase {
  // 获取用户特定的键名
  static getUserKey(key) {
    const currentUser = UserManager.getCurrentUser();
    if (!currentUser) {
      return `bahasa_beraja_guest_${key}`;
    }
    return `bahasa_beraja_${currentUser.id}_${key}`;
  }

  // 获取用户进度数据
  static getUserProgress() {
    try {
      const data = localStorage.getItem(this.getUserKey('user_progress'));
      return data ? JSON.parse(data) : {
        currentCategory: 0,
        currentWord: 0,
        lastActive: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {
        currentCategory: 0,
        currentWord: 0,
        lastActive: new Date().toISOString()
      };
    }
  }

  // 保存用户进度数据
  static saveUserProgress(progress) {
    try {
      const data = {
        ...this.getUserProgress(),
        ...progress,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem(this.getUserKey('user_progress'), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  // 获取词汇掌握程度
  static getVocabularyMastery() {
    try {
      const data = localStorage.getItem(this.getUserKey('vocabulary_mastery'));
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting vocabulary mastery:', error);
      return {};
    }
  }

  // 更新单词掌握程度
  static updateWordMastery(categoryIndex, wordIndex, level) {
    try {
      const mastery = this.getVocabularyMastery();
      
      if (!mastery[categoryIndex]) {
        mastery[categoryIndex] = {};
      }
      
      mastery[categoryIndex][wordIndex] = {
        level: level,
        reviewCount: (mastery[categoryIndex][wordIndex]?.reviewCount || 0) + 1,
        lastReviewed: new Date().toISOString(),
        firstLearned: mastery[categoryIndex][wordIndex]?.firstLearned || new Date().toISOString()
      };
      
      localStorage.setItem(this.getUserKey('vocabulary_mastery'), JSON.stringify(mastery));
      
      // 同步到 PostgreSQL (如果可用)
      this.syncToPostgres('vocabulary_mastery', mastery);
      
      return true;
    } catch (error) {
      console.error('Error updating word mastery:', error);
      return false;
    }
  }

  // 获取学习统计
  static getLearningStats() {
    try {
      const data = localStorage.getItem(this.getUserKey('learning_stats'));
      return data ? JSON.parse(data) : {
        totalStudyTime: 0,
        wordsLearned: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streak: 0,
        lastStudyDate: null,
        studyDates: []
      };
    } catch (error) {
      console.error('Error getting learning stats:', error);
      return {
        totalStudyTime: 0,
        wordsLearned: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streak: 0,
        lastStudyDate: null,
        studyDates: []
      };
    }
  }

  // 更新学习统计
  static updateLearningStats(updates) {
    try {
      const stats = this.getLearningStats();
      const newStats = {
        ...stats,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.getUserKey('learning_stats'), JSON.stringify(newStats));
      
      // 同步到 PostgreSQL (如果可用)
      this.syncToPostgres('learning_stats', newStats);
      
      return true;
    } catch (error) {
      console.error('Error updating learning stats:', error);
      return false;
    }
  }

  // 获取测验历史
  static getQuizHistory() {
    try {
      const data = localStorage.getItem(this.getUserKey('quiz_history'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting quiz history:', error);
      return [];
    }
  }

  // 保存测验结果
  static saveQuizResult(quizResult) {
    try {
      const history = this.getQuizHistory();
      const result = {
        ...quizResult,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      history.unshift(result);
      
      // 只保留最近50次测验记录
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem(this.getUserKey('quiz_history'), JSON.stringify(history));
      
      // 更新统计数据
      this.updateLearningStats({
        quizzesTaken: this.getLearningStats().quizzesTaken + 1,
        correctAnswers: this.getLearningStats().correctAnswers + quizResult.correctAnswers
      });
      
      // 同步到 PostgreSQL (如果可用)
      this.syncToPostgres('quiz_history', history);
      
      return true;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      return false;
    }
  }

  // 更新连续学习天数
  static updateStreak() {
    try {
      const stats = this.getLearningStats();
      const today = new Date().toDateString();
      const lastStudyDate = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;
      
      let newStreak = stats.streak || 0;
      let studyDates = stats.studyDates || [];
      
      if (lastStudyDate !== today) {
        // 添加今天到学习日期列表
        if (!studyDates.includes(today)) {
          studyDates.push(today);
          studyDates.sort();
        }
        
        if (lastStudyDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          
          if (lastStudyDate === yesterdayStr) {
            // 连续学习
            newStreak += 1;
          } else {
            // 中断了连续学习
            newStreak = 1;
          }
        } else {
          // 首次学习
          newStreak = 1;
        }
        
        this.updateLearningStats({
          streak: newStreak,
          lastStudyDate: today,
          studyDates: studyDates
        });
      }
      
      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      return 0;
    }
  }

  // 计算连续学习天数
  static calculateStreak() {
    const stats = this.getLearningStats();
    return stats.streak || 0;
  }

  // 获取学习分析数据
  static getLearningAnalytics() {
    try {
      const mastery = this.getVocabularyMastery();
      const stats = this.getLearningStats();
      const quizHistory = this.getQuizHistory();
      
      // 计算各种统计数据
      const totalWords = Object.values(mastery).reduce((total, category) => {
        return total + Object.keys(category).length;
      }, 0);
      
      const masteredWords = Object.values(mastery).reduce((total, category) => {
        return total + Object.values(category).filter(word => word.level >= 3).length;
      }, 0);
      
      const averageQuizScore = quizHistory.length > 0 
        ? quizHistory.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizHistory.length 
        : 0;
      
      return {
        totalWordsLearned: totalWords,
        masteredWords: masteredWords,
        averageQuizScore: Math.round(averageQuizScore),
        totalStudyTime: stats.totalStudyTime || 0,
        currentStreak: stats.streak || 0,
        totalQuizzes: quizHistory.length,
        studyDays: (stats.studyDates || []).length
      };
    } catch (error) {
      console.error('Error getting learning analytics:', error);
      return {
        totalWordsLearned: 0,
        masteredWords: 0,
        averageQuizScore: 0,
        totalStudyTime: 0,
        currentStreak: 0,
        totalQuizzes: 0,
        studyDays: 0
      };
    }
  }

  // 清除用户数据
  static clearUserData() {
    try {
      const keys = [
        'user_progress',
        'vocabulary_mastery',
        'vocabulary_book',
        'learning_stats',
        'quiz_history'
      ];
      
      keys.forEach(key => {
        localStorage.removeItem(this.getUserKey(key));
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }

  // 导出用户数据
  static exportUserData() {
    try {
      const currentUser = UserManager.getCurrentUser();
      if (!currentUser) return null;

      return {
        user: currentUser,
        progress: this.getUserProgress(),
        mastery: this.getVocabularyMastery(),
        vocabularyBook: this.getVocabularyBook(),
        stats: this.getLearningStats(),
        quizHistory: this.getQuizHistory(),
        exportDate: new Date().toISOString(),
        version: DB_VERSION
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // 导入用户数据
  static importUserData(data) {
    try {
      if (!data || data.version !== DB_VERSION) {
        return false;
      }

      if (data.progress) {
        localStorage.setItem(this.getUserKey('user_progress'), JSON.stringify(data.progress));
      }
      
      if (data.mastery) {
        localStorage.setItem(this.getUserKey('vocabulary_mastery'), JSON.stringify(data.mastery));
      }
      
      if (data.vocabularyBook) {
        localStorage.setItem(this.getUserKey('vocabulary_book'), JSON.stringify(data.vocabularyBook));
      }
      
      if (data.stats) {
        localStorage.setItem(this.getUserKey('learning_stats'), JSON.stringify(data.stats));
      }
      
      if (data.quizHistory) {
        localStorage.setItem(this.getUserKey('quiz_history'), JSON.stringify(data.quizHistory));
      }

      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  // 同步数据到 PostgreSQL (可选功能)
  static async syncToPostgres(dataType, data) {
    try {
      const currentUser = UserManager.getCurrentUser();
      if (!currentUser) return;

      // 这里可以添加实际的 PostgreSQL 同步逻辑
      // 目前只是模拟同步
      console.log(`Syncing ${dataType} to PostgreSQL for user ${currentUser.id}`);
      
      // 实际实现中，这里会发送数据到后端 API
      // const response = await fetch('/api/sync', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: currentUser.id,
      //     dataType: dataType,
      //     data: data
      //   })
      // });
      
      return true;
    } catch (error) {
      console.error('Error syncing to PostgreSQL:', error);
      return false;
    }
  }

  // 从 PostgreSQL 恢复数据 (可选功能)
  static async restoreFromPostgres() {
    try {
      const currentUser = UserManager.getCurrentUser();
      if (!currentUser) return false;

      // 这里可以添加实际的 PostgreSQL 恢复逻辑
      console.log(`Restoring data from PostgreSQL for user ${currentUser.id}`);
      
      // 实际实现中，这里会从后端 API 获取数据
      // const response = await fetch(`/api/user/${currentUser.id}/data`);
      // const userData = await response.json();
      // return this.importUserData(userData);
      
      return true;
    } catch (error) {
      console.error('Error restoring from PostgreSQL:', error);
      return false;
    }
  }

  // ============= 生词本功能 =============

  // 获取生词本数据
  static getVocabularyBook() {
    try {
      const data = localStorage.getItem(this.getUserKey('vocabulary_book'));
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting vocabulary book:', error);
      return {};
    }
  }

  // 添加单词到生词本
  static addToVocabularyBook(categoryIndex, wordIndex, reason = 'incorrect') {
    try {
      const vocabularyBook = this.getVocabularyBook();
      
      if (!vocabularyBook[categoryIndex]) {
        vocabularyBook[categoryIndex] = {};
      }
      
      vocabularyBook[categoryIndex][wordIndex] = {
        addedDate: new Date().toISOString(),
        reason: reason, // 'incorrect', 'difficult', 'manual'
        incorrectCount: (vocabularyBook[categoryIndex][wordIndex]?.incorrectCount || 0) + 1,
        correctStreakCount: 0, // 连续答对次数
        lastIncorrectDate: new Date().toISOString(),
        reviewCount: vocabularyBook[categoryIndex][wordIndex]?.reviewCount || 0
      };
      
      localStorage.setItem(this.getUserKey('vocabulary_book'), JSON.stringify(vocabularyBook));
      
      // 同步到 PostgreSQL (如果可用)
      this.syncToPostgres('vocabulary_book', vocabularyBook);
      
      return true;
    } catch (error) {
      console.error('Error adding word to vocabulary book:', error);
      return false;
    }
  }

  // 从生词本中移除单词（掌握了）
  static removeFromVocabularyBook(categoryIndex, wordIndex) {
    try {
      const vocabularyBook = this.getVocabularyBook();
      
      if (vocabularyBook[categoryIndex] && vocabularyBook[categoryIndex][wordIndex]) {
        delete vocabularyBook[categoryIndex][wordIndex];
        
        // 如果该分类下没有生词了，删除分类
        if (Object.keys(vocabularyBook[categoryIndex]).length === 0) {
          delete vocabularyBook[categoryIndex];
        }
        
        localStorage.setItem(this.getUserKey('vocabulary_book'), JSON.stringify(vocabularyBook));
        
        // 同步到 PostgreSQL (如果可用)
        this.syncToPostgres('vocabulary_book', vocabularyBook);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing word from vocabulary book:', error);
      return false;
    }
  }

  // 更新生词本中单词的学习状态
  static updateVocabularyBookWord(categoryIndex, wordIndex, isCorrect) {
    try {
      const vocabularyBook = this.getVocabularyBook();
      
      if (!vocabularyBook[categoryIndex] || !vocabularyBook[categoryIndex][wordIndex]) {
        return false;
      }
      
      const wordData = vocabularyBook[categoryIndex][wordIndex];
      wordData.reviewCount = (wordData.reviewCount || 0) + 1;
      wordData.lastReviewDate = new Date().toISOString();
      
      if (isCorrect) {
        // 答对了，增加连续答对次数
        wordData.correctStreakCount = (wordData.correctStreakCount || 0) + 1;
        
        // 连续答对3次，从生词本中移除
        if (wordData.correctStreakCount >= 3) {
          this.removeFromVocabularyBook(categoryIndex, wordIndex);
          return true;
        }
      } else {
        // 答错了，重置连续答对次数，增加错误次数
        wordData.correctStreakCount = 0;
        wordData.incorrectCount = (wordData.incorrectCount || 0) + 1;
        wordData.lastIncorrectDate = new Date().toISOString();
      }
      
      localStorage.setItem(this.getUserKey('vocabulary_book'), JSON.stringify(vocabularyBook));
      
      // 同步到 PostgreSQL (如果可用)
      this.syncToPostgres('vocabulary_book', vocabularyBook);
      
      return true;
    } catch (error) {
      console.error('Error updating vocabulary book word:', error);
      return false;
    }
  }

  // 检查单词是否在生词本中
  static isWordInVocabularyBook(categoryIndex, wordIndex) {
    try {
      const vocabularyBook = this.getVocabularyBook();
      return !!(vocabularyBook[categoryIndex] && vocabularyBook[categoryIndex][wordIndex]);
    } catch (error) {
      console.error('Error checking word in vocabulary book:', error);
      return false;
    }
  }

  // 获取生词本统计信息
  static getVocabularyBookStats() {
    try {
      const vocabularyBook = this.getVocabularyBook();
      
      let totalWords = 0;
      let totalReviews = 0;
      let wordsByCategory = {};
      let difficultWords = []; // 错误次数最多的词汇
      
      Object.keys(vocabularyBook).forEach(categoryIndex => {
        const categoryWords = vocabularyBook[categoryIndex];
        const categoryCount = Object.keys(categoryWords).length;
        totalWords += categoryCount;
        wordsByCategory[categoryIndex] = categoryCount;
        
        Object.keys(categoryWords).forEach(wordIndex => {
          const wordData = categoryWords[wordIndex];
          totalReviews += wordData.reviewCount || 0;
          
          // 收集困难词汇（错误次数>=3次）
          if (wordData.incorrectCount >= 3) {
            difficultWords.push({
              categoryIndex: parseInt(categoryIndex),
              wordIndex: parseInt(wordIndex),
              incorrectCount: wordData.incorrectCount,
              correctStreakCount: wordData.correctStreakCount || 0
            });
          }
        });
      });
      
      // 按错误次数排序困难词汇
      difficultWords.sort((a, b) => b.incorrectCount - a.incorrectCount);
      
      return {
        totalWords,
        totalReviews,
        wordsByCategory,
        difficultWords: difficultWords.slice(0, 10), // 只返回前10个最困难的词汇
        averageReviewsPerWord: totalWords > 0 ? Math.round(totalReviews / totalWords) : 0
      };
    } catch (error) {
      console.error('Error getting vocabulary book stats:', error);
      return {
        totalWords: 0,
        totalReviews: 0,
        wordsByCategory: {},
        difficultWords: [],
        averageReviewsPerWord: 0
      };
    }
  }

  // 根据测验结果自动管理生词本
  static processQuizResultForVocabularyBook(quizResults) {
    try {
      if (!quizResults || !Array.isArray(quizResults)) {
        return false;
      }
      
      quizResults.forEach(result => {
        const { categoryIndex, wordIndex, isCorrect } = result;
        
        if (typeof categoryIndex !== 'number' || typeof wordIndex !== 'number') {
          return;
        }
        
        const isInVocabularyBook = this.isWordInVocabularyBook(categoryIndex, wordIndex);
        
        if (isCorrect) {
          // 答对了
          if (isInVocabularyBook) {
            // 如果在生词本中，更新状态（可能会移除）
            this.updateVocabularyBookWord(categoryIndex, wordIndex, true);
          }
          // 如果不在生词本中且答对了，不需要做任何操作
        } else {
          // 答错了
          if (isInVocabularyBook) {
            // 如果已经在生词本中，更新错误状态
            this.updateVocabularyBookWord(categoryIndex, wordIndex, false);
          } else {
            // 如果不在生词本中，添加到生词本
            this.addToVocabularyBook(categoryIndex, wordIndex, 'incorrect');
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error processing quiz result for vocabulary book:', error);
      return false;
    }
  }

  // 获取需要复习的生词（按优先级排序）
  static getWordsToReview(limit = 20) {
    try {
      const vocabularyBook = this.getVocabularyBook();
      const wordsToReview = [];
      
      Object.keys(vocabularyBook).forEach(categoryIndex => {
        const categoryWords = vocabularyBook[categoryIndex];
        
        Object.keys(categoryWords).forEach(wordIndex => {
          const wordData = categoryWords[wordIndex];
          const lastReviewDate = wordData.lastReviewDate ? new Date(wordData.lastReviewDate) : new Date(wordData.addedDate);
          const daysSinceLastReview = Math.floor((new Date() - lastReviewDate) / (1000 * 60 * 60 * 24));
          
          // 计算复习优先级：错误次数越多，距离上次复习时间越长，优先级越高
          const priority = (wordData.incorrectCount || 1) * (daysSinceLastReview + 1) / ((wordData.correctStreakCount || 0) + 1);
          
          wordsToReview.push({
            categoryIndex: parseInt(categoryIndex),
            wordIndex: parseInt(wordIndex),
            priority: priority,
            incorrectCount: wordData.incorrectCount || 0,
            correctStreakCount: wordData.correctStreakCount || 0,
            daysSinceLastReview: daysSinceLastReview
          });
        });
      });
      
      // 按优先级排序，返回前limit个
      wordsToReview.sort((a, b) => b.priority - a.priority);
      return wordsToReview.slice(0, limit);
    } catch (error) {
      console.error('Error getting words to review:', error);
      return [];
    }
  }
}

export default LocalDatabase; 