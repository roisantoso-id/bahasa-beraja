import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { grammarData } from '../data/grammar';

const GrammarContainer = styled.div`
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

const LessonCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const LessonTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #b48a4a;
  margin-bottom: 15px;
`;

const LessonDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const RuleSection = styled.div`
  margin-bottom: 40px;
`;

const RuleItem = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #b48a4a;
`;

const RuleTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const Example = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
`;

const IndonesianText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #b48a4a;
  margin-bottom: 5px;
`;

const ChineseText = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
`;

const Breakdown = styled.div`
  font-size: 14px;
  color: #888;
  font-style: italic;
`;

const ExerciseSection = styled.div`
  margin-top: 40px;
`;

const ExerciseTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #b48a4a;
  margin-bottom: 20px;
`;

const QuestionCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
`;

const Question = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const OptionButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => 
    props.$selected 
      ? (props.$correct ? '#10b981' : '#ef4444')
      : '#ddd'
  };
  border-radius: 8px;
  background: ${props => 
    props.$selected 
      ? (props.$correct ? '#dcfce7' : '#fee2e2')
      : 'white'
  };
  color: ${props => 
    props.$selected 
      ? (props.$correct ? '#065f46' : '#991b1b')
      : '#333'
  };
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 16px;

  &:hover {
    border-color: #b48a4a;
    background: rgba(180, 138, 74, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ExplanationBox = styled(motion.div)`
  background: white;
  border: 2px solid #10b981;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
`;

const ExplanationText = styled.p`
  color: #065f46;
  margin: 0;
  line-height: 1.5;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

const ControlButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #b48a4a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #a47a3a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Progress = styled.div`
  background: rgba(255, 255, 255, 0.2);
  height: 8px;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$width}%;
`;

const LessonCount = styled.div`
  text-align: center;
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
`;

function Grammar() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  const currentLesson = grammarData[currentLessonIndex];
  const progress = ((currentLessonIndex + 1) / grammarData.length) * 100;

  const handleAnswerSelect = (exerciseIndex, optionIndex) => {
    const key = `${currentLessonIndex}-${exerciseIndex}`;
    setSelectedAnswers({
      ...selectedAnswers,
      [key]: optionIndex
    });
    
    // Show explanation after selection
    setShowExplanations({
      ...showExplanations,
      [key]: true
    });
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < grammarData.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentExercise(0);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentExercise(0);
    }
  };

  const handleReset = () => {
    setCurrentLessonIndex(0);
    setCurrentExercise(0);
    setSelectedAnswers({});
    setShowExplanations({});
  };

  return (
    <GrammarContainer>
      <Title>语法练习</Title>
      
      <LessonCount>
        第 {currentLessonIndex + 1} 课，共 {grammarData.length} 课
      </LessonCount>

      <Progress>
        <ProgressBar $width={progress} />
      </Progress>

      <AnimatePresence mode="wait">
        <LessonCard
          key={currentLessonIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <LessonTitle>{currentLesson.title}</LessonTitle>
          <LessonDescription>{currentLesson.description}</LessonDescription>

          <RuleSection>
            <h3 style={{ color: '#b48a4a', marginBottom: '20px' }}>语法规则</h3>
            {currentLesson.rules.map((rule, index) => (
              <RuleItem key={index}>
                <RuleTitle>{rule.rule}</RuleTitle>
                <Example>
                  <IndonesianText>{rule.example}</IndonesianText>
                  <ChineseText>{rule.translation}</ChineseText>
                  <Breakdown>{rule.breakdown}</Breakdown>
                </Example>
              </RuleItem>
            ))}
          </RuleSection>

          <ExerciseSection>
            <ExerciseTitle>练习题</ExerciseTitle>
            {currentLesson.exercises.map((exercise, exerciseIndex) => {
              const key = `${currentLessonIndex}-${exerciseIndex}`;
              const selectedAnswer = selectedAnswers[key];
              const showExplanation = showExplanations[key];

              return (
                <QuestionCard key={exerciseIndex}>
                  <Question>{exercise.question}</Question>
                  <OptionsContainer>
                    {exercise.options.map((option, optionIndex) => (
                      <OptionButton
                        key={optionIndex}
                        $selected={selectedAnswer === optionIndex}
                        $correct={selectedAnswer === optionIndex && optionIndex === exercise.correct}
                        onClick={() => handleAnswerSelect(exerciseIndex, optionIndex)}
                        disabled={selectedAnswer !== undefined}
                      >
                        {option}
                        {selectedAnswer === optionIndex && (
                          optionIndex === exercise.correct 
                            ? <CheckCircle size={20} style={{ marginLeft: 'auto' }} />
                            : <XCircle size={20} style={{ marginLeft: 'auto' }} />
                        )}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                  
                  <AnimatePresence>
                    {showExplanation && (
                      <ExplanationBox
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ExplanationText>{exercise.explanation}</ExplanationText>
                      </ExplanationBox>
                    )}
                  </AnimatePresence>
                </QuestionCard>
              );
            })}
          </ExerciseSection>
        </LessonCard>
      </AnimatePresence>

      <Controls>
        <ControlButton
          onClick={handlePrevLesson}
          disabled={currentLessonIndex === 0}
        >
          <ChevronLeft size={20} />
          上一课
        </ControlButton>
        
        <ControlButton onClick={handleReset}>
          <RotateCcw size={20} />
          重新开始
        </ControlButton>
        
        <ControlButton
          onClick={handleNextLesson}
          disabled={currentLessonIndex === grammarData.length - 1}
        >
          下一课
          <ChevronRight size={20} />
        </ControlButton>
      </Controls>
    </GrammarContainer>
  );
}

export default Grammar; 