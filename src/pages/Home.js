import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Trophy, TrendingUp, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocalDatabase from '../utils/database';

const GOLD_GRADIENT = 'linear-gradient(135deg, #f7d774 0%, #fff 100%)';
const GOLD = '#f7d774';
const GOLD_DARK = '#b48a4a';

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  padding: 20px;
  background-color: #fff;
  
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/assets/batikbg.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.8;
    z-index: -1;
  }

  > * { 
    position: relative; 
    z-index: 1; 
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 60px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

const HeroLogo = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const LogoIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px #b48a4a33;
  border: 3px solid ${GOLD_DARK};
  overflow: hidden;
  background: white;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    border-radius: 14px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 17px;
  @media (max-width: 768px) {
    border-radius: 14px;
  }
  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

const LogoText = styled.div`
  color: ${GOLD_DARK};
  text-shadow: 0 2px 10px #f7d77499;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const LogoTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 5px;
  color: ${GOLD_DARK};

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
    margin-bottom: 3px;
  }
`;

const LogoSubtitle = styled.div`
  font-size: 16px;
  opacity: 0.9;
  font-weight: 500;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    letter-spacing: 0.5px;
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: ${GOLD_DARK};
  margin-bottom: 20px;
  text-shadow: 0 2px 10px #f7d77499;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 24px;
  color: #b48a4a;
  margin-bottom: 40px;
  text-shadow: 0 1px 5px #f7d77466;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 25px;
    padding: 0 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 30px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    padding: 25px 20px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
    border-radius: 14px;
  }
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: #b48a4a;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #b48a4a;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 30px;
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1.5px solid #e7cfa2;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    padding: 30px 25px;
    border-radius: 16px;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 14px;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f7d774 0%, #fff 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: white;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    margin-bottom: 12px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

const FeatureButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff2e3c 0%, #fff 100%);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #ff2e3c;

  &:hover {
    background: #ff2e3c;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 46, 60, 0.18);
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
    width: 100%;
    justify-content: center;
  }
`;

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 60px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 30px 25px;
    margin-bottom: 40px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    margin-bottom: 30px;
    border-radius: 14px;
  }
`;

const ProgressTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const ProgressItem = styled.div`
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #f7d774 0%, #fff 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$width}%;
`;

const ProgressCard = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 10px;
  }
`;

const ProgressLabel = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
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

const ProgressValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #b48a4a;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const ProgressDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const QuickActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.95);
  color: #b48a4a;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 2px solid #e7cfa2;
  transition: all 0.3s ease;

  &:hover {
    background: #b48a4a;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(180,138,74,0.10);
  }
`;

const CommunitySection = styled(motion.div)`
  background: rgba(255,255,255,0.97);
  border-radius: 32px;
  padding: 48px;
  margin: 60px auto 40px;
  max-width: 900px;
  backdrop-filter: blur(10px);
  border: 2px solid #ff2e3c;
  box-shadow: 0 20px 40px rgba(255,46,60,0.08);
  text-align: center;
`;

const CommunityContent = styled.div`
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CommunityImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 20px;
  object-fit: cover;
  border: 3px solid #25D366;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    margin-bottom: 12px;
  }
`;

const CommunityImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const CommunityTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const CommunitySubtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 12px;
    padding: 0 10px;
  }
`;

const JoinButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: #25D366;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);

  &:hover {
    background: #128C7E;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
  }

  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 14px;
    gap: 8px;
    width: 100%;
    max-width: 280px;
  }
`;

const WhatsAppIcon = styled.span`
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 25px 0;
  text-align: left;

  @media (max-width: 768px) {
    gap: 12px;
    margin: 20px 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 15px 0;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 15px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    gap: 6px;
    justify-content: center;
  }

  &::before {
    content: '✓';
    color: #25D366;
    font-weight: bold;
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 16px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`;

// 印尼国徽 Garuda SVG
const GarudaIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{marginRight: 12, verticalAlign: 'middle'}}>
    <g>
      <path d="M8,32 Q2,18 18,18 Q8,8 24,12 Q18,2 32,8 Q46,2 40,12 Q56,8 46,18 Q62,18 56,32" stroke="#b48a4a" strokeWidth="2" fill="none"/>
      <ellipse cx="32" cy="32" rx="10" ry="16" fill="#b48a4a" stroke="#7c5a1a" strokeWidth="2"/>
      <circle cx="32" cy="18" r="6" fill="#b48a4a" stroke="#7c5a1a" strokeWidth="2"/>
      <path d="M32,18 Q36,20 32,22" stroke="#7c5a1a" strokeWidth="2" fill="none"/>
      <path d="M28,48 Q26,54 30,54" stroke="#7c5a1a" strokeWidth="2" fill="none"/>
      <path d="M36,48 Q38,54 34,54" stroke="#7c5a1a" strokeWidth="2" fill="none"/>
      <rect x="28" y="30" width="8" height="10" rx="2" fill="#fff" stroke="#7c5a1a" strokeWidth="1.5"/>
      <rect x="30" y="32" width="4" height="6" rx="1" fill="#ff2e3c"/>
    </g>
  </svg>
);

// Batik 波浪 SVG（主色金色）
const BatikWaveSVG = ({ style }) => (
  <svg width="100%" height="32" viewBox="0 0 360 32" fill="none" style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <pattern id="batikPatternHome" patternUnits="userSpaceOnUse" width="60" height="32">
        <path d="M0,16 Q15,0 30,16 T60,16" stroke="#e7cfa2" strokeWidth="2" fill="none"/>
        <circle cx="15" cy="16" r="2.5" fill="#f7d774" opacity="0.7"/>
        <circle cx="45" cy="16" r="2.5" fill="#f7d774" opacity="0.7"/>
      </pattern>
    </defs>
    <rect width="360" height="32" fill="url(#batikPatternHome)" />
  </svg>
);

// 主要按钮和高亮色用金色
const MainButton = styled.button`
  background: linear-gradient(135deg, #f7d774 0%, #fff 100%);
  color: #b48a4a;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 28px;
  box-shadow: 0 4px 16px rgba(180,138,74,0.10);
  transition: all 0.3s cubic-bezier(.4,2,.6,1);
  cursor: pointer;
  &:hover {
    background: #f7d774;
    color: #fff;
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(247,215,116,0.18);
  }
  &:active {
    transform: scale(0.97);
    box-shadow: 0 2px 8px rgba(180,138,74,0.18);
  }
`;

// 卡片、社群区等边框和阴影用淡金色
const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 10px 32px rgba(180,138,74,0.10), 0 2px 8px rgba(247,215,116,0.06);
  border: 1.5px solid #e7cfa2;
  padding: 32px;
  margin-bottom: 32px;
`;

function Home() {
  const [stats, setStats] = useState({
    wordsLearned: 0,
    streak: 0,
    quizzesTaken: 0,
    averageScore: 0,
    masteredWords: 0,
    totalStudyTime: 0
  });

  const [categoryProgress, setCategoryProgress] = useState([]);

  useEffect(() => {
    // 加载学习统计
    const learningStats = LocalDatabase.getLearningStats();
    const userProgress = LocalDatabase.getUserProgress();
    const vocabularyMastery = LocalDatabase.getVocabularyMastery();
    const quizHistory = LocalDatabase.getQuizHistory();

    // 计算掌握的词汇数量
    const masteredWords = Object.values(vocabularyMastery).reduce((total, category) => {
      return total + Object.values(category).filter(word => word.level >= 3).length;
    }, 0);

    // 计算总学习词汇
    const totalWordsLearned = Object.values(vocabularyMastery).reduce((total, category) => {
      return total + Object.values(category).filter(word => word.level >= 1).length;
    }, 0);

    // 计算平均分数
    const avgScore = quizHistory.length > 0 
      ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / quizHistory.length)
      : 0;

    // 计算连续天数
    const streak = LocalDatabase.calculateStreak();

    setStats({
      wordsLearned: totalWordsLearned,
      streak: streak,
      quizzesTaken: quizHistory.length,
      averageScore: avgScore,
      masteredWords: masteredWords,
      totalStudyTime: Math.floor(learningStats.totalStudyTime / 60) // 转换为分钟
    });

    // 计算各分类进度
    const vocabularyData = require('../data/vocabulary').vocabularyData;
    const progress = vocabularyData.map(category => {
      const categoryMastery = vocabularyMastery[category.id] || {};
      const totalWords = category.words.length;
      const learnedWords = Object.values(categoryMastery).filter(word => word.level >= 1).length;
      const masteredWords = Object.values(categoryMastery).filter(word => word.level >= 3).length;
      
      return {
        name: category.category,
        learned: (learnedWords / totalWords) * 100,
        mastered: (masteredWords / totalWords) * 100
      };
    }).filter(category => category.learned < 100); // 过滤掉已完全掌握的类别

    setCategoryProgress(progress);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <HomeContainer>
      {/* 顶部 Batik 波浪装饰 */}
      <BatikWaveSVG style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 2 }} />
      <Hero>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, marginBottom: 10}}>
          <GarudaIcon />
          <span style={{fontSize: 32, color: '#ff2e3c', fontWeight: 700, marginLeft: 8}}>Garuda Belajar Bahasa</span>
        </div>
        <HeroLogo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LogoIcon>
            <LogoImage src="/assets/pclog.jpeg" alt="Company Logo" />
          </LogoIcon>
          <LogoText>
            <LogoTitle>Bahasa Beraja</LogoTitle>
            <LogoSubtitle>Master Indonesian with Confidence</LogoSubtitle>
          </LogoText>
        </HeroLogo>
        <Title>智能印尼语学习平台</Title>
        <Subtitle>
          Selamat datang di platform belajar bahasa Indonesia!<br/>
          掌握印尼语，开启东南亚之旅
        </Subtitle>
      </Hero>

      <StatsGrid>
        <StatCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <StatIcon>
            <BookOpen size={40} />
          </StatIcon>
          <StatValue>{stats.wordsLearned}</StatValue>
          <StatLabel>已学词汇</StatLabel>
        </StatCard>

        <StatCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <StatIcon>
            <Target size={40} />
          </StatIcon>
          <StatValue>{stats.masteredWords}</StatValue>
          <StatLabel>已掌握词汇</StatLabel>
        </StatCard>

        <StatCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <StatIcon>
            <Calendar size={40} />
          </StatIcon>
          <StatValue>{stats.streak}</StatValue>
          <StatLabel>连续学习天数</StatLabel>
        </StatCard>

        <StatCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <StatIcon>
            <Trophy size={40} />
          </StatIcon>
          <StatValue>{stats.averageScore}%</StatValue>
          <StatLabel>平均测验分数</StatLabel>
        </StatCard>
      </StatsGrid>

      {categoryProgress.length > 0 && (
        <ProgressSection>
          <ProgressTitle>学习进度</ProgressTitle>
          <ProgressGrid>
            {categoryProgress.map((category, index) => (
              <ProgressItem key={index}>
                <ProgressLabel>{category.name}</ProgressLabel>
                <ProgressBar>
                  <ProgressFill $width={category.learned} />
                </ProgressBar>
                <ProgressValue>{Math.round(category.learned)}%</ProgressValue>
              </ProgressItem>
            ))}
          </ProgressGrid>
        </ProgressSection>
      )}

      <FeaturesGrid>
        <FeatureCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <FeatureIcon>
            <BookOpen size={30} />
          </FeatureIcon>
          <FeatureTitle>互动词汇学习</FeatureTitle>
          <FeatureDescription>
            通过翻卡片的方式学习500+印尼语词汇，包含发音、例句和中文释义。支持学习进度跟踪和掌握程度标记。
          </FeatureDescription>
          <FeatureButton to="/vocabulary">开始学习</FeatureButton>
        </FeatureCard>

        <FeatureCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <FeatureIcon>
            <Brain size={30} />
          </FeatureIcon>
          <FeatureTitle>语法课程</FeatureTitle>
          <FeatureDescription>
            系统学习印尼语语法规则，包括词序、代词、动词时态等。每个语法点都配有详细解释和练习题。
          </FeatureDescription>
          <FeatureButton to="/grammar">语法学习</FeatureButton>
        </FeatureCard>

        <FeatureCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <FeatureIcon>
            <Trophy size={30} />
          </FeatureIcon>
          <FeatureTitle>智能测验</FeatureTitle>
          <FeatureDescription>
            根据你的学习进度智能生成测验题目。支持多种难度级别和时间模式，帮助巩固学习成果。
          </FeatureDescription>
          <FeatureButton to="/quiz">开始测验</FeatureButton>
        </FeatureCard>
      </FeaturesGrid>

      <QuickActions>
        <QuickActionButton to="/vocabulary">
          <BookOpen size={20} />
          继续学习词汇
        </QuickActionButton>
        <QuickActionButton to="/quiz">
          <Trophy size={20} />
          开始智能测验
        </QuickActionButton>
        <QuickActionButton to="/grammar">
          <Brain size={20} />
          学习语法知识
        </QuickActionButton>
      </QuickActions>

      <CommunitySection>
        <CommunityContent>
          <CommunityTitle>
            🌐 印尼语学习交流社群 | Komunitas Belajar Bahasa Indonesia
          </CommunityTitle>
          <CommunitySubtitle>
            与全球印尼语学习者交流经验，分享学习资源，获取最新学习动态<br/>
            <em style={{ color: '#b48a4a', fontSize: '16px' }}>
              Bergabunglah dengan pelajar bahasa Indonesia dari seluruh dunia, berbagi pengalaman dan sumber belajar
            </em>
          </CommunitySubtitle>
          <CommunityImageContainer style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CommunityImage src="/wechat.jpg" alt="微信群二维码" style={{ width: 180, height: 180, borderRadius: 16, border: '3px solid #09bb07', boxShadow: '0 4px 16px #09bb0733' }} />
              <div style={{ marginTop: 8, fontWeight: 'bold', fontSize: 18, color: '#09bb07' }}>加入微信群</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CommunityImage src="/whatsapp-group.jpg" alt="WhatsApp Indonesian Learning Community" style={{ width: 120, height: 120, borderRadius: 12, border: '2px solid #25d366', boxShadow: '0 2px 8px #25d36633' }} />
              <JoinButton as="a" href="https://chat.whatsapp.com/DhyJ8M3sopvHsk02vDOzU1" target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                <WhatsAppIcon>📱</WhatsAppIcon>
                加入WhatsApp社群
              </JoinButton>
            </div>
          </CommunityImageContainer>
        </CommunityContent>
      </CommunitySection>
      {/* 底部 Batik 波浪装饰 */}
      <BatikWaveSVG style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 2, transform: 'rotate(180deg)' }} />
    </HomeContainer>
  );
}

export default Home; 