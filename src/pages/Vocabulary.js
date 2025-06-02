import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, RotateCcw, Star } from 'lucide-react';
import { vocabularyData } from '../data/vocabulary';
import LocalDatabase from '../utils/database';

const VocabularyContainer = styled.div`
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 15px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  overflow-x: auto;
  padding: 0 10px;
`;

const CategoryTab = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$active ? '#667eea' : 'white'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const CategoryProgress = styled.div`
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const CategoryProgressBar = styled.div`
  height: 100%;
  background: #667eea;
  width: ${props => props.$width}%;
  transition: width 0.3s ease;
`;

const CardContainer = styled.div`
  position: relative;
  height: 400px;
  margin-bottom: 30px;
  perspective: 1000px;
`;

const FlashCard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s ease-in-out;
  transform: ${props => props.$isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const CardBack = styled(CardFace)`
  background: white;
  color: #333;
  transform: rotateY(180deg);
`;

const Word = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Pronunciation = styled.div`
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 20px;
  font-style: italic;
`;

const Chinese = styled.h3`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #667eea;
`;

const Example = styled.div`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 10px;
`;

const ExampleChinese = styled.div`
  font-size: 16px;
  color: #666;
  font-style: italic;
`;

const MasteryIndicator = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 5px;
`;

const MasteryLevel = styled.div`
  background: ${props => props.$level >= props.$current ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 50%;
  width: 8px;
  height: 8px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const ControlButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const MasteryButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const MasteryButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.$selected ? '#667eea' : '#ddd'};
  border-radius: 20px;
  background: ${props => props.$selected ? '#667eea' : 'white'};
  color: ${props => props.$selected ? 'white' : '#666'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: ${props => props.$selected ? '#667eea' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const Progress = styled.div`
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$width}%;
`;

const WordCount = styled.div`
  text-align: center;
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
`;

function Vocabulary() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabularyMastery, setVocabularyMastery] = useState({});
  const [learningStats, setLearningStats] = useState({});
  const [studyStartTime, setStudyStartTime] = useState(Date.now());

  const currentCategory = vocabularyData[selectedCategory];
  const currentWord = currentCategory.words[currentWordIndex];
  const progress = ((currentWordIndex + 1) / currentCategory.words.length) * 100;

  // 加载数据
  useEffect(() => {
    const mastery = LocalDatabase.getVocabularyMastery();
    const stats = LocalDatabase.getLearningStats();
    const userProgress = LocalDatabase.getUserProgress();
    
    setVocabularyMastery(mastery);
    setLearningStats(stats);
    
    // 恢复用户上次的学习位置
    if (userProgress.currentCategory !== undefined) {
      setSelectedCategory(userProgress.currentCategory);
      setCurrentWordIndex(userProgress.currentWord || 0);
    }
    
    // 更新连续学习天数
    LocalDatabase.updateStreak();
  }, []);

  // 保存学习进度
  useEffect(() => {
    LocalDatabase.saveUserProgress({
      currentCategory: selectedCategory,
      currentWord: currentWordIndex
    });
  }, [selectedCategory, currentWordIndex]);

  // 在切换词汇时重置翻转状态
  useEffect(() => {
    setIsFlipped(false);
  }, [currentWordIndex, selectedCategory]);

  // 获取当前词汇的掌握程度
  const getCurrentWordMastery = () => {
    const categoryMastery = vocabularyMastery[selectedCategory] || {};
    return categoryMastery[currentWordIndex]?.level || 0;
  };

  // 计算分类完成度
  const getCategoryProgress = (categoryIndex) => {
    const categoryMastery = vocabularyMastery[categoryIndex] || {};
    const totalWords = vocabularyData[categoryIndex].words.length;
    const masteredWords = Object.values(categoryMastery).filter(word => word.level >= 2).length;
    return (masteredWords / totalWords) * 100;
  };

  const handleCategoryChange = (categoryIndex) => {
    // 保存学习时间
    const studyTime = Math.floor((Date.now() - studyStartTime) / 1000);
    LocalDatabase.updateLearningStats({
      totalStudyTime: learningStats.totalStudyTime + studyTime
    });
    
    setSelectedCategory(categoryIndex);
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setStudyStartTime(Date.now());
  };

  const handleNextWord = () => {
    if (currentWordIndex < currentCategory.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    
    // 如果是第一次翻转到背面，记录为学习过
    if (!isFlipped) {
      const currentMastery = getCurrentWordMastery();
      if (currentMastery === 0) {
        handleMasteryChange(1); // 设为初学
      }
    }
  };

  const handleMasteryChange = (level) => {
    LocalDatabase.updateWordMastery(selectedCategory, currentWordIndex, level);
    
    // 更新本地状态
    const newMastery = { ...vocabularyMastery };
    if (!newMastery[selectedCategory]) {
      newMastery[selectedCategory] = {};
    }
    newMastery[selectedCategory][currentWordIndex] = {
      level,
      reviewCount: (newMastery[selectedCategory][currentWordIndex]?.reviewCount || 0) + 1,
      lastReviewed: new Date().toISOString()
    };
    setVocabularyMastery(newMastery);
    
    // 更新学习统计
    const newWordsLearned = Object.values(newMastery).reduce((total, category) => {
      return total + Object.values(category).filter(word => word.level >= 1).length;
    }, 0);
    
    LocalDatabase.updateLearningStats({
      wordsLearned: newWordsLearned
    });
  };

  const handleReset = () => {
    setCurrentWordIndex(0);
    setIsFlipped(false);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentWord.indonesian);
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
      const indonesianVoice = voices.find(voice => 
        voice.lang.startsWith('id') || 
        voice.lang.startsWith('ID') ||
        voice.name.toLowerCase().includes('indones')
      );
      
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      } else {
        const femaleVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          voice.name.toLowerCase().includes('female')
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          utterance.rate = 0.7;
        }
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  // 计算统计数据
  const totalWordsLearned = Object.values(vocabularyMastery).reduce((total, category) => {
    return total + Object.values(category).filter(word => word.level >= 1).length;
  }, 0);

  const masteredWords = Object.values(vocabularyMastery).reduce((total, category) => {
    return total + Object.values(category).filter(word => word.level >= 3).length;
  }, 0);

  const currentStreak = LocalDatabase.calculateStreak();

  return (
    <VocabularyContainer>
      <Title>词汇学习</Title>
      
      <StatsContainer>
        <StatCard>
          <StatValue>{totalWordsLearned}</StatValue>
          <StatLabel>已学词汇</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{masteredWords}</StatValue>
          <StatLabel>已掌握</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{currentStreak}</StatValue>
          <StatLabel>连续天数</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <CategoryTabs>
        {vocabularyData.map((category, index) => (
          <CategoryTab
            key={category.id}
            $active={selectedCategory === index}
            onClick={() => handleCategoryChange(index)}
          >
            {category.category}
            <CategoryProgress>
              <CategoryProgressBar $width={getCategoryProgress(index)} />
            </CategoryProgress>
          </CategoryTab>
        ))}
      </CategoryTabs>

      <WordCount>
        第 {currentWordIndex + 1} 个，共 {currentCategory.words.length} 个词汇
      </WordCount>

      <Progress>
        <ProgressBar $width={progress} />
      </Progress>

      <CardContainer>
        <FlashCard
          onClick={handleFlip}
          $isFlipped={isFlipped}
        >
          <MasteryIndicator>
            {[1, 2, 3].map(level => (
              <MasteryLevel 
                key={level} 
                $current={level} 
                $level={getCurrentWordMastery()}
              />
            ))}
          </MasteryIndicator>
          
          <CardFront>
            <Word>{currentWord.indonesian}</Word>
            <Pronunciation>[ {currentWord.pronunciation} ]</Pronunciation>
            <div style={{ fontSize: '16px', opacity: 0.8 }}>
              点击卡片查看中文释义
            </div>
          </CardFront>
          
          <CardBack>
            <Chinese>{currentWord.chinese}</Chinese>
            <Example>{currentWord.example}</Example>
            <ExampleChinese>{currentWord.exampleChinese}</ExampleChinese>
          </CardBack>
        </FlashCard>
      </CardContainer>

      <MasteryButtons>
        <MasteryButton
          $selected={getCurrentWordMastery() === 1}
          onClick={() => handleMasteryChange(1)}
        >
          初学
        </MasteryButton>
        <MasteryButton
          $selected={getCurrentWordMastery() === 2}
          onClick={() => handleMasteryChange(2)}
        >
          熟悉
        </MasteryButton>
        <MasteryButton
          $selected={getCurrentWordMastery() === 3}
          onClick={() => handleMasteryChange(3)}
        >
          掌握
        </MasteryButton>
      </MasteryButtons>

      <Controls>
        <ControlButton
          onClick={handlePrevWord}
          disabled={currentWordIndex === 0}
        >
          <ChevronLeft size={24} />
        </ControlButton>
        
        <ControlButton onClick={speakWord}>
          <Volume2 size={24} />
        </ControlButton>
        
        <ControlButton onClick={handleReset}>
          <RotateCcw size={24} />
        </ControlButton>
        
        <ControlButton
          onClick={handleNextWord}
          disabled={currentWordIndex === currentCategory.words.length - 1}
        >
          <ChevronRight size={24} />
        </ControlButton>
      </Controls>
    </VocabularyContainer>
  );
}

export default Vocabulary; 