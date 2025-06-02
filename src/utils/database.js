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
}

export default LocalDatabase; 