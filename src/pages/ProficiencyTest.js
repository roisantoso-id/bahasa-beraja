import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { proficiencyTestQuestions, determineProficiencyLevel, getProficiencyDescription } from '../data/proficiencyTest';
import UserManager from '../utils/userManager';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const QuestionCard = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const QuestionText = styled.h3`
  color: #2d3748;
  margin-bottom: 15px;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#2d3748'};
  border: 2px solid #667eea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${props => props.selected ? '#667eea' : '#f7fafc'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
`;

const ResultCard = styled.div`
  text-align: center;
  padding: 30px;
`;

const ResultTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 15px;
`;

const ResultDescription = styled.p`
  color: #4a5568;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const Recommendation = styled.div`
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: #5a67d8;
  }
`;

function ProficiencyTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  // 检查用户是否已经完成过测试
  useEffect(() => {
    const currentUser = UserManager.getCurrentUser();
    if (currentUser?.proficiencyLevel) {
      navigate('/');
    }
  }, [navigate]);

  const startTest = () => {
    setTestStarted(true);
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < proficiencyTestQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    proficiencyTestQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && question.options[userAnswer].correct) {
        correctAnswers++;
      }
    });

    const finalScore = (correctAnswers / proficiencyTestQuestions.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    // 更新用户的语言水平
    const level = determineProficiencyLevel(finalScore);
    UserManager.updateUser({
      proficiencyLevel: level,
      proficiencyScore: finalScore,
      testCompletedAt: new Date().toISOString()
    });
  };

  if (!testStarted) {
    return (
      <TestContainer>
        <ResultCard>
          <ResultTitle>印尼语能力测试</ResultTitle>
          <ResultDescription>
            这个测试将帮助评估您的印尼语水平，以便我们为您提供最适合的学习内容。
            测试包含15个问题，涵盖不同难度级别。
            请认真回答每个问题，这将帮助我们更好地了解您的语言水平。
          </ResultDescription>
          <Button onClick={startTest}>开始测试</Button>
        </ResultCard>
      </TestContainer>
    );
  }

  if (showResults) {
    const level = determineProficiencyLevel(score);
    const result = getProficiencyDescription(level);

    return (
      <TestContainer>
        <ResultCard>
          <ResultTitle>{result.title}</ResultTitle>
          <ResultDescription>{result.description}</ResultDescription>
          <Recommendation>
            <h3>学习建议</h3>
            <p>{result.recommendation}</p>
          </Recommendation>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </ResultCard>
      </TestContainer>
    );
  }

  const question = proficiencyTestQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / proficiencyTestQuestions.length) * 100;

  return (
    <TestContainer>
      <ProgressBar>
        <Progress progress={progress} />
      </ProgressBar>
      <QuestionCard>
        <QuestionText>
          问题 {currentQuestion + 1}/{proficiencyTestQuestions.length}: {question.question}
        </QuestionText>
        <OptionsList>
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              selected={answers[question.id] === index}
              onClick={() => handleAnswer(question.id, index)}
            >
              {option.text}
            </OptionButton>
          ))}
        </OptionsList>
      </QuestionCard>
      <Button onClick={handleNext}>
        {currentQuestion === proficiencyTestQuestions.length - 1 ? '完成测试' : '下一题'}
      </Button>
    </TestContainer>
  );
}

export default ProficiencyTest; 