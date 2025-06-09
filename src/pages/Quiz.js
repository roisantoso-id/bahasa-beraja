import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Play } from 'lucide-react';
import { vocabularyData } from '../data/vocabulary';
import LocalDatabase from '../utils/database';

const GOLD_GRADIENT = 'linear-gradient(135deg, #f7d774 0%, #fff 100%)';
const GOLD = '#f7d774';
const GOLD_DARK = '#b48a4a';

const QuizContainer = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 15px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 12px 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    border-radius: 10px;
    min-width: 80px;
  }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${GOLD_DARK};

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const QuizSetup = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 30px 25px;
    border-radius: 16px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 14px;
    margin-bottom: 20px;
  }
`;

const SetupTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const OptionGroup = styled.div`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const OptionLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const OptionButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const OptionButton = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.$active ? GOLD_DARK : '#ddd'};
  border-radius: 25px;
  background: ${props => props.$active ? GOLD_GRADIENT : 'white'};
  color: ${props => props.$active ? 'white' : GOLD_DARK};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${GOLD_DARK};
    background: ${props => props.$active ? GOLD_GRADIENT : GOLD};
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 18px;
    flex: 1;
    min-width: 0;
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${GOLD_GRADIENT};
  color: ${GOLD_DARK};
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px ${GOLD}44;
    background: ${GOLD};
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 15px;
    border-radius: 18px;
  }
`;

const QuizCard = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px ${GOLD_DARK}22;

  @media (max-width: 768px) {
    padding: 30px 25px;
    border-radius: 16px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 14px;
    margin-bottom: 20px;
  }
`;

const QuestionNumber = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

const Question = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  gap: 15px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const AnswerOption = styled.button`
  padding: 16px 20px;
  border: 2px solid ${props => {
    if (props.$showResult) {
      if (props.$isCorrect) return '#10b981';
      if (props.$isSelected && !props.$isCorrect) return '#ef4444';
      return '#ddd';
    }
    return props.$isSelected ? '#b48a4a' : '#ddd';
  }};
  border-radius: 15px;
  background: ${props => {
    if (props.$showResult) {
      if (props.$isCorrect) return '#dcfce7';
      if (props.$isSelected && !props.$isCorrect) return '#fee2e2';
      return 'white';
    }
    return props.$isSelected ? 'rgba(180, 138, 74, 0.08)' : 'white';
  }};
  color: #333;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 15px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 10px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
  }
`;

const AnswerIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 480px) {
    right: 14px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    height: 6px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    height: 5px;
    margin-bottom: 12px;
  }
`;

const Progress = styled.div`
  height: 100%;
  background: ${GOLD_GRADIENT};
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$width}%;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 15px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 12px;
    gap: 6px;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  position: sticky;
  bottom: 20px;
  z-index: 10;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 15px;
    padding: 15px 0;
    border-radius: 12px;
    margin-top: 15px;
    bottom: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 12px 10px;
    border-radius: 10px;
    margin-top: 12px;
    bottom: 10px;
  }
`;

const ControlButton = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: 25px;
  background: ${GOLD_GRADIENT};
  color: ${GOLD_DARK};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  box-shadow: 0 4px 15px ${GOLD}44;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${GOLD}66;
    background: ${GOLD};
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: #ccc;
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 15px;
    min-width: 100px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 80px;
    border-radius: 18px;
    flex: 1;
    max-width: 140px;
  }
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 30px 25px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 14px;
  }
`;

const ResultTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 14px;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #b48a4a;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    margin-bottom: 20px;
  }
`;

const ResultStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const ResultStat = styled.div`
  text-align: center;
`;

const ResultStatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #b48a4a;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const ResultStatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

function Quiz() {
  const [quizState, setQuizState] = useState('setup'); // setup, quiz, result
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(null);

  const [quizHistory, setQuizHistory] = useState([]);
  const [learningStats, setLearningStats] = useState({});

  // 加载数据
  useEffect(() => {
    const history = LocalDatabase.getQuizHistory();
    const stats = LocalDatabase.getLearningStats();
    
    setQuizHistory(history);
    setLearningStats(stats);
  }, []);

  // 计时器
  useEffect(() => {
    let timer;
    if (quizState === 'quiz' && timeLimit && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeLimit, timeLeft, showResult]);

  const generateQuestions = () => {
    let wordPool = [];
    
    if (category === 'all') {
      wordPool = vocabularyData.flatMap((cat, catIdx) => 
        cat.words.map((word, index) => ({ ...word, categoryId: cat.id, categoryIndex: catIdx, wordIndex: index }))
      );
    } else {
      const selectedCategory = vocabularyData.find(cat => cat.id === category);
      const catIdx = vocabularyData.findIndex(cat => cat.id === category);
      wordPool = selectedCategory.words.map((word, index) => 
        ({ ...word, categoryId: selectedCategory.id, categoryIndex: catIdx, wordIndex: index })
      );
    }

    // 根据掌握程度过滤
    const mastery = LocalDatabase.getVocabularyMastery();
    if (difficulty === 'easy') {
      // 简单：未学习和初学的词汇
      wordPool = wordPool.filter(word => {
        const masteryLevel = mastery[word.categoryId]?.[word.wordIndex]?.level || 0;
        return masteryLevel <= 1;
      });
    } else if (difficulty === 'medium') {
      // 中等：熟悉的词汇
      wordPool = wordPool.filter(word => {
        const masteryLevel = mastery[word.categoryId]?.[word.wordIndex]?.level || 0;
        return masteryLevel === 2;
      });
    } else {
      // 困难：已掌握的词汇
      wordPool = wordPool.filter(word => {
        const masteryLevel = mastery[word.categoryId]?.[word.wordIndex]?.level || 0;
        return masteryLevel >= 3;
      });
    }

    // 如果过滤后的词汇不够，使用所有词汇
    if (wordPool.length < questionCount) {
      if (category === 'all') {
        wordPool = vocabularyData.flatMap(cat => 
          cat.words.map((word, index) => ({ ...word, categoryId: cat.id, wordIndex: index }))
        );
      } else {
        const selectedCategory = vocabularyData.find(cat => cat.id === category);
        wordPool = selectedCategory.words.map((word, index) => 
          ({ ...word, categoryId: selectedCategory.id, wordIndex: index })
        );
      }
    }

    // 随机选择题目
    const shuffled = wordPool.sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, questionCount);

    // 为每个词汇生成选项
    const generatedQuestions = selectedWords.map(word => {
      // 获取其他词汇作为错误选项
      const otherWords = wordPool.filter(w => w.indonesian !== word.indonesian);
      const wrongOptions = otherWords
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.chinese);

      const options = [word.chinese, ...wrongOptions].sort(() => 0.5 - Math.random());

      return {
        question: word.indonesian,
        correctAnswer: word.chinese,
        options,
        word
      };
    });

    setQuestions(generatedQuestions);
  };

  const startQuiz = () => {
    generateQuestions();
    setQuizState('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setStartTime(Date.now());
    if (timeLimit) {
      setTimeLeft(30);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, {
      question: questions[currentQuestion].question,
      selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect,
      timeSpent: timeLimit ? (30 - timeLeft) : null
    }];
    setAnswers(newAnswers);

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        if (timeLimit) {
          setTimeLeft(30);
        }
      } else {
        finishQuiz(newAnswers);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(''); // 设置为空字符串表示超时
    }
    handleNext();
  };

  const finishQuiz = (finalAnswers) => {
    const correctCount = finalAnswers.reduce((count, answer) => 
      count + (answer.isCorrect ? 1 : 0), 0
    );
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const totalTime = timeLimit - timeLeft;
    
    const quizResult = {
      score: finalScore,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      timeTaken: totalTime,
      difficulty: difficulty,
      categories: category,
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    };
    
    // 保存测验结果
    LocalDatabase.saveQuizResult(quizResult);
    
    // 处理生词本 - 将答题结果转换为生词本需要的格式
    const vocabularyBookResults = finalAnswers.map((answer, index) => {
      const question = questions[index];
      // categoryIndex 必须为数字下标
      let categoryIndex = question.categoryIndex;
      if (typeof categoryIndex !== 'number') {
        categoryIndex = vocabularyData.findIndex(cat => cat.id === question.categoryId);
      }
      return {
        categoryIndex,
        wordIndex: question.wordIndex,
        isCorrect: answer.isCorrect
      };
    });
    
    // 自动管理生词本
    LocalDatabase.processQuizResultForVocabularyBook(vocabularyBookResults);
    
    setQuizState('result');
  };

  const resetQuiz = () => {
    setQuizState('setup');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setQuestions([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算统计数据
  const totalQuizzes = quizHistory.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0 
    ? Math.max(...quizHistory.map(quiz => quiz.score))
    : 0;

  if (quizState === 'setup') {
    return (
      <QuizContainer>
        <Title>智能测验</Title>
        
        <StatsContainer>
          <StatCard>
            <StatValue>{totalQuizzes}</StatValue>
            <StatLabel>测验次数</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageScore}%</StatValue>
            <StatLabel>平均分数</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{bestScore}%</StatValue>
            <StatLabel>最高分数</StatLabel>
          </StatCard>
        </StatsContainer>

        <QuizSetup>
          <SetupTitle>设置测验</SetupTitle>
          
          <OptionGroup>
            <OptionLabel>难度等级</OptionLabel>
            <OptionButtons>
              <OptionButton
                $active={difficulty === 'easy'}
                onClick={() => setDifficulty('easy')}
              >
                简单 (未学习词汇)
              </OptionButton>
              <OptionButton
                $active={difficulty === 'medium'}
                onClick={() => setDifficulty('medium')}
              >
                中等 (熟悉词汇)
              </OptionButton>
              <OptionButton
                $active={difficulty === 'hard'}
                onClick={() => setDifficulty('hard')}
              >
                困难 (已掌握词汇)
              </OptionButton>
            </OptionButtons>
          </OptionGroup>

          <OptionGroup>
            <OptionLabel>词汇分类</OptionLabel>
            <OptionButtons>
              <OptionButton
                $active={category === 'all'}
                onClick={() => setCategory('all')}
              >
                全部分类
              </OptionButton>
              {vocabularyData.map(cat => (
                <OptionButton
                  key={cat.id}
                  $active={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.category}
                </OptionButton>
              ))}
            </OptionButtons>
          </OptionGroup>

          <OptionGroup>
            <OptionLabel>题目数量</OptionLabel>
            <OptionButtons>
              {[5, 10, 15, 20].map(count => (
                <OptionButton
                  key={count}
                  $active={questionCount === count}
                  onClick={() => setQuestionCount(count)}
                >
                  {count} 题
                </OptionButton>
              ))}
            </OptionButtons>
          </OptionGroup>

          <OptionGroup>
            <OptionLabel>时间限制</OptionLabel>
            <OptionButtons>
              <OptionButton
                $active={!timeLimit}
                onClick={() => setTimeLimit(false)}
              >
                无限制
              </OptionButton>
              <OptionButton
                $active={timeLimit}
                onClick={() => setTimeLimit(true)}
              >
                每题30秒
              </OptionButton>
            </OptionButtons>
          </OptionGroup>

          <StartButton onClick={startQuiz}>
            <Play size={20} style={{ marginRight: '10px' }} />
            开始测验
          </StartButton>
        </QuizSetup>
      </QuizContainer>
    );
  }

  if (quizState === 'result') {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const totalTime = answers.reduce((total, answer) => {
      return total + (answer.timeSpent || 0);
    }, 0);

    return (
      <QuizContainer>
        <Title>测验结果</Title>
        
        <ResultCard>
          <ResultTitle>恭喜完成测验！</ResultTitle>
          <ScoreDisplay>{score}%</ScoreDisplay>
          
          <ResultStats>
            <ResultStat>
              <ResultStatValue>{correctCount}</ResultStatValue>
              <ResultStatLabel>正确答案</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{questions.length - correctCount}</ResultStatValue>
              <ResultStatLabel>错误答案</ResultStatLabel>
            </ResultStat>
            <ResultStat>
              <ResultStatValue>{questions.length}</ResultStatValue>
              <ResultStatLabel>总题数</ResultStatLabel>
            </ResultStat>
            {timeLimit && (
              <ResultStat>
                <ResultStatValue>{formatTime(totalTime)}</ResultStatValue>
                <ResultStatLabel>总用时</ResultStatLabel>
              </ResultStat>
            )}
          </ResultStats>

          <Controls>
            <ControlButton onClick={resetQuiz}>
              <RotateCcw size={24} />
            </ControlButton>
          </Controls>
        </ResultCard>
      </QuizContainer>
    );
  }

  // Quiz in progress
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <QuizContainer>
      <Title>智能测验</Title>
      
      <ProgressBar>
        <Progress $width={progress} />
      </ProgressBar>

      {timeLimit && (
        <Timer>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </Timer>
      )}

      <AnimatePresence mode="wait">
        <QuizCard
          key={currentQuestion}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionNumber>
            第 {currentQuestion + 1} 题，共 {questions.length} 题
          </QuestionNumber>
          
          <Question>{currentQ?.question}</Question>
          
          <OptionsContainer>
            {currentQ?.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQ.correctAnswer;
              
              return (
                <AnswerOption
                  key={index}
                  $isSelected={isSelected}
                  $isCorrect={isCorrect}
                  $showResult={showResult}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {option}
                  {showResult && (
                    <AnswerIcon>
                      {isCorrect ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : isSelected ? (
                        <XCircle size={20} color="#ef4444" />
                      ) : null}
                    </AnswerIcon>
                  )}
                </AnswerOption>
              );
            })}
          </OptionsContainer>

          {!showResult && (
            <Controls>
              <ControlButton 
                onClick={handleNext}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === questions.length - 1 ? '完成' : '下一题'}
              </ControlButton>
            </Controls>
          )}
        </QuizCard>
      </AnimatePresence>
    </QuizContainer>
  );
}

export default Quiz; 