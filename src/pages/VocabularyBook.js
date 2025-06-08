import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Clock, Target, Play, X, CheckCircle, AlertCircle } from 'lucide-react';
import LocalDatabase from '../utils/database';
import { vocabularyData } from '../data/vocabulary';

const VocabularyBookContainer = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    margin-bottom: 25px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 6px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 0 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 25px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
    border-radius: 10px;
  }
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  color: #667eea;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? '#667eea' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.$active ? 'white' : '#667eea'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#667eea' : '#667eea'};
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 13px;
    border-radius: 18px;
    flex: 1;
    min-width: 80px;
  }
`;

const WordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 25px;
  }
`;

const WordCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
    flex-direction: column;
    gap: 10px;
  }
`;

const WordInfo = styled.div`
  flex: 1;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const WordIndonesian = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 4px;
  }
`;

const WordChinese = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 6px;
  }
`;

const WordCategory = styled.span`
  font-size: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 6px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 6px;
  }
`;

const WordStats = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-top: 10px;
    padding-top: 10px;
  }
`;

const WordStat = styled.div`
  text-align: center;
  flex: 1;
`;

const WordStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$color || '#667eea'};
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const WordStatLabel = styled.div`
  font-size: 12px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.$danger ? '#ff4757' : '#667eea'};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${props => props.$danger ? 'rgba(255, 71, 87, 0.3)' : 'rgba(102, 126, 234, 0.3)'};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
    font-size: 10px;
    border-radius: 6px;
    align-self: flex-start;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 40px 16px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 30px 12px;
    border-radius: 14px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 12px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 6px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 20px;
    padding: 0 10px;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 15px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 18px;
    width: 100%;
    max-width: 200px;
  }
`;

const ReviewModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 30px 25px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 14px;
    margin: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }

  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    font-size: 20px;
    padding: 4px;
  }
`;

function VocabularyBook() {
  const [activeTab, setActiveTab] = useState('all');
  const [vocabularyBook, setVocabularyBook] = useState({});
  const [stats, setStats] = useState({});
  const [wordsToReview, setWordsToReview] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    loadVocabularyBookData();
  }, []);

  const loadVocabularyBookData = () => {
    const bookData = LocalDatabase.getVocabularyBook();
    const statsData = LocalDatabase.getVocabularyBookStats();
    const reviewWords = LocalDatabase.getWordsToReview(20);
    
    setVocabularyBook(bookData);
    setStats(statsData);
    setWordsToReview(reviewWords);
  };

  const removeFromBook = (categoryIndex, wordIndex) => {
    LocalDatabase.removeFromVocabularyBook(categoryIndex, wordIndex);
    loadVocabularyBookData();
  };

  const startReview = () => {
    if (wordsToReview.length > 0) {
      setCurrentReviewIndex(0);
      setIsReviewMode(true);
    }
  };

  const closeReview = () => {
    setIsReviewMode(false);
    setCurrentReviewIndex(0);
    loadVocabularyBookData();
  };

  const nextReviewWord = () => {
    if (currentReviewIndex < wordsToReview.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      closeReview();
    }
  };

  const markAsCorrect = () => {
    const word = wordsToReview[currentReviewIndex];
    LocalDatabase.updateVocabularyBookWord(word.categoryIndex, word.wordIndex, true);
    nextReviewWord();
  };

  const markAsIncorrect = () => {
    const word = wordsToReview[currentReviewIndex];
    LocalDatabase.updateVocabularyBookWord(word.categoryIndex, word.wordIndex, false);
    nextReviewWord();
  };

  const getWordsToDisplay = () => {
    const words = [];
    
    Object.keys(vocabularyBook).forEach(categoryIndex => {
      const categoryWords = vocabularyBook[categoryIndex];
      const category = vocabularyData[parseInt(categoryIndex)];
      
      if (!category) return;
      
      Object.keys(categoryWords).forEach(wordIndex => {
        const wordData = categoryWords[wordIndex];
        const word = category.words[parseInt(wordIndex)];
        
        if (!word) return;
        
        const shouldShow = activeTab === 'all' || 
          (activeTab === 'difficult' && wordData.incorrectCount >= 3) ||
          (activeTab === 'recent' && 
            new Date() - new Date(wordData.addedDate) <= 7 * 24 * 60 * 60 * 1000);
        
        if (shouldShow) {
          words.push({
            ...word,
            categoryIndex: parseInt(categoryIndex),
            wordIndex: parseInt(wordIndex),
            categoryName: category.category,
            ...wordData
          });
        }
      });
    });
    
    return words.sort((a, b) => b.incorrectCount - a.incorrectCount);
  };

  const getCurrentReviewWord = () => {
    if (!isReviewMode || currentReviewIndex >= wordsToReview.length) return null;
    
    const reviewWord = wordsToReview[currentReviewIndex];
    const category = vocabularyData[reviewWord.categoryIndex];
    const word = category?.words[reviewWord.wordIndex];
    
    return word ? { ...word, categoryName: category.category } : null;
  };

  const wordsToDisplay = getWordsToDisplay();
  const currentWord = getCurrentReviewWord();

  return (
    <VocabularyBookContainer>
      <Header>
        <Title>📚 我的生词本</Title>
        <Subtitle>复习错误词汇，提升学习效果</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <BookOpen size={30} />
          </StatIcon>
          <StatValue>{stats.totalWords || 0}</StatValue>
          <StatLabel>生词总数</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <TrendingUp size={30} />
          </StatIcon>
          <StatValue>{stats.totalReviews || 0}</StatValue>
          <StatLabel>复习次数</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <Target size={30} />
          </StatIcon>
          <StatValue>{stats.averageReviewsPerWord || 0}</StatValue>
          <StatLabel>平均复习次数</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <Clock size={30} />
          </StatIcon>
          <StatValue>{wordsToReview.length}</StatValue>
          <StatLabel>需要复习</StatLabel>
        </StatCard>
      </StatsGrid>

      {wordsToReview.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <StartButton onClick={startReview}>
            <Play size={16} style={{ marginRight: '8px' }} />
            开始复习 ({wordsToReview.length} 个单词)
          </StartButton>
        </div>
      )}

      <TabContainer>
        <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          全部生词
        </Tab>
        <Tab $active={activeTab === 'difficult'} onClick={() => setActiveTab('difficult')}>
          困难词汇
        </Tab>
        <Tab $active={activeTab === 'recent'} onClick={() => setActiveTab('recent')}>
          最近添加
        </Tab>
      </TabContainer>

      {wordsToDisplay.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎉</EmptyIcon>
          <EmptyTitle>
            {activeTab === 'all' ? '生词本是空的' : 
             activeTab === 'difficult' ? '没有困难词汇' : '最近没有新增生词'}
          </EmptyTitle>
          <EmptyDescription>
            {activeTab === 'all' ? 
              '太棒了！你还没有生词，继续保持！去做一些测验来挑战自己吧。' :
              activeTab === 'difficult' ?
              '很好！你没有特别困难的词汇，学习效果不错！' :
              '最近7天内没有新增生词，继续努力学习吧！'
            }
          </EmptyDescription>
          {activeTab === 'all' && (
            <StartButton as="a" href="/quiz">
              去做测验
            </StartButton>
          )}
        </EmptyState>
      ) : (
        <WordGrid>
          {wordsToDisplay.map((word, index) => (
            <WordCard
              key={`${word.categoryIndex}-${word.wordIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WordHeader>
                <WordInfo>
                  <WordIndonesian>{word.indonesian}</WordIndonesian>
                  <WordChinese>{word.chinese}</WordChinese>
                  <WordCategory>{word.categoryName}</WordCategory>
                </WordInfo>
                <ActionButton 
                  $danger 
                  onClick={() => removeFromBook(word.categoryIndex, word.wordIndex)}
                >
                  <X size={12} />
                  移除
                </ActionButton>
              </WordHeader>
              
              <WordStats>
                <WordStat>
                  <WordStatValue $color="#ff4757">
                    {word.incorrectCount}
                  </WordStatValue>
                  <WordStatLabel>错误次数</WordStatLabel>
                </WordStat>
                <WordStat>
                  <WordStatValue $color="#2ed573">
                    {word.correctStreakCount}
                  </WordStatValue>
                  <WordStatLabel>连续答对</WordStatLabel>
                </WordStat>
                <WordStat>
                  <WordStatValue>
                    {word.reviewCount}
                  </WordStatValue>
                  <WordStatLabel>复习次数</WordStatLabel>
                </WordStat>
              </WordStats>
            </WordCard>
          ))}
        </WordGrid>
      )}

      <AnimatePresence>
        {isReviewMode && currentWord && (
          <ReviewModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CloseButton onClick={closeReview}>
                <X size={20} />
              </CloseButton>
              
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '10px', color: '#333' }}>
                  {currentWord.indonesian}
                </h2>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>
                  {currentWord.chinese}
                </p>
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '14px'
                }}>
                  {currentWord.categoryName}
                </span>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                  第 {currentReviewIndex + 1} / {wordsToReview.length} 个
                </p>
                <p style={{ fontSize: '18px', color: '#333' }}>
                  你记住这个单词了吗？
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <ActionButton 
                  onClick={markAsIncorrect}
                  $danger
                  style={{ padding: '12px 24px', fontSize: '16px' }}
                >
                  <AlertCircle size={16} />
                  还没记住
                </ActionButton>
                <ActionButton 
                  onClick={markAsCorrect}
                  style={{ padding: '12px 24px', fontSize: '16px' }}
                >
                  <CheckCircle size={16} />
                  已经记住
                </ActionButton>
              </div>
            </ModalContent>
          </ReviewModal>
        )}
      </AnimatePresence>
    </VocabularyBookContainer>
  );
}

export default VocabularyBook; 