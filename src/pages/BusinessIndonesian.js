import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  businessVocabularyData, 
  businessScenariosData, 
  businessSentencesData 
} from '../data/business-vocabulary';

const BusinessContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f7d774 0%, #fff 100%);
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const BusinessContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BusinessHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    gap: 10px;
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.active ? '#b48a4a' : 'white'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    color: #b48a4a;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`;

const ContentPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 5px;
  }
`;

// 词汇学习组件样式
const VocabularyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const CategoryCard = styled(motion.div)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 15px;
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 10px;
    font-weight: 600;
  }

  p {
    opacity: 0.9;
    font-size: 0.95rem;
  }
`;

const WordCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  border-left: 5px solid #b48a4a;

  .word-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }

  .indonesian {
    font-size: 1.4rem;
    font-weight: 700;
    color: #2c3e50;
  }

  .chinese {
    font-size: 1.2rem;
    color: #e74c3c;
    font-weight: 600;
  }

  .pronunciation {
    font-size: 1rem;
    color: #8e44ad;
    font-style: italic;
    margin-bottom: 10px;
  }

  .example {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    margin-top: 10px;

    .example-indo {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .example-chinese {
      color: #7f8c8d;
      font-size: 0.95rem;
    }
  }
`;

// 场景对话组件样式
const ScenarioContainer = styled.div`
  display: grid;
  gap: 25px;
`;

const ScenarioCard = styled(motion.div)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 15px;
  padding: 25px;
  color: white;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    font-weight: 600;
  }
`;

const DialogueBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;

  .dialogue-item {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 10px;
    
    &:nth-child(odd) {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }
    
    &:nth-child(even) {
      background: #f3e5f5;
      border-left: 4px solid #9c27b0;
    }

    .speaker {
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .text-indo {
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .text-chinese {
      color: #e74c3c;
      margin-bottom: 5px;
    }

    .pronunciation {
      font-size: 0.9rem;
      color: #8e44ad;
      font-style: italic;
    }
  }
`;

// 实用句子组件样式
const SentenceContainer = styled.div`
  display: grid;
  gap: 25px;
`;

const SentenceCategory = styled(motion.div)`
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border-radius: 15px;
  padding: 25px;
  color: white;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 20px;
    font-weight: 600;
  }
`;

const SentenceItem = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  color: #333;

  .sentence-indo {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  .sentence-chinese {
    color: #e74c3c;
    margin-bottom: 5px;
  }

  .sentence-pronunciation {
    font-size: 0.9rem;
    color: #8e44ad;
    font-style: italic;
    margin-bottom: 8px;
  }

  .usage {
    background: #e8f5e8;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #2e7d32;
    border-left: 3px solid #4caf50;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #f7d774 0%, #fff 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const BusinessIndonesian = () => {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const tabs = [
    { id: 'vocabulary', label: '商务词汇', icon: '📚' },
    { id: 'scenarios', label: '场景对话', icon: '💬' },
    { id: 'sentences', label: '实用句子', icon: '📝' }
  ];

  const renderVocabularyContent = () => {
    if (selectedCategory) {
      const category = businessVocabularyData.find(cat => cat.id === selectedCategory);
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={() => setSelectedCategory(null)}>
            ← 返回分类
          </BackButton>
          <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem' }}>
            {category.category}
          </h2>
          {category.words.map((word, index) => (
            <WordCard
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="word-header">
                <div className="indonesian">{word.indonesian}</div>
                <div className="chinese">{word.chinese}</div>
              </div>
              <div className="pronunciation">[{word.pronunciation}]</div>
              <div className="example">
                <div className="example-indo">{word.example}</div>
                <div className="example-chinese">{word.exampleChinese}</div>
              </div>
            </WordCard>
          ))}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem', textAlign: 'center' }}>
          选择词汇分类
        </h2>
        <VocabularyGrid>
          {businessVocabularyData.map((category) => (
            <CategoryCard
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <h3>{category.category}</h3>
              <p>{category.words.length} 个单词</p>
            </CategoryCard>
          ))}
        </VocabularyGrid>
      </motion.div>
    );
  };

  const renderScenariosContent = () => {
    if (selectedScenario) {
      const scenario = businessScenariosData.find(s => s.id === selectedScenario);
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={() => setSelectedScenario(null)}>
            ← 返回场景列表
          </BackButton>
          <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem' }}>
            {scenario.title}
          </h2>
          <DialogueBox>
            {scenario.dialogues.map((dialogue, index) => (
              <div key={index} className="dialogue-item">
                <div className="speaker">说话者 {dialogue.speaker}:</div>
                <div className="text-indo">{dialogue.indonesian}</div>
                <div className="text-chinese">{dialogue.chinese}</div>
                <div className="pronunciation">[{dialogue.pronunciation}]</div>
              </div>
            ))}
          </DialogueBox>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem', textAlign: 'center' }}>
          商务场景对话
        </h2>
        <ScenarioContainer>
          {businessScenariosData.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <h3>{scenario.title}</h3>
              <p>{scenario.dialogues.length} 段对话</p>
            </ScenarioCard>
          ))}
        </ScenarioContainer>
      </motion.div>
    );
  };

  const renderSentencesContent = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ color: '#2c3e50', marginBottom: '25px', fontSize: '1.8rem', textAlign: 'center' }}>
          商务实用句子
        </h2>
        <SentenceContainer>
          {businessSentencesData.map((category) => (
            <SentenceCategory
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: category.id * 0.1 }}
            >
              <h3>{category.category}</h3>
              {category.sentences.map((sentence, index) => (
                <SentenceItem key={index}>
                  <div className="sentence-indo">{sentence.indonesian}</div>
                  <div className="sentence-chinese">{sentence.chinese}</div>
                  <div className="sentence-pronunciation">[{sentence.pronunciation}]</div>
                  <div className="usage">💡 {sentence.usage}</div>
                </SentenceItem>
              ))}
            </SentenceCategory>
          ))}
        </SentenceContainer>
      </motion.div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return renderVocabularyContent();
      case 'scenarios':
        return renderScenariosContent();
      case 'sentences':
        return renderSentencesContent();
      default:
        return null;
    }
  };

  return (
    <BusinessContainer>
      <BusinessContent>
        <BusinessHeader>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🏢 商务印尼语
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            专业商务场景，提升职场印尼语沟通能力
          </motion.p>
        </BusinessHeader>

        <TabContainer>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedCategory(null);
                setSelectedScenario(null);
              }}
            >
              {tab.icon} {tab.label}
            </TabButton>
          ))}
        </TabContainer>

        <ContentPanel
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </ContentPanel>
      </BusinessContent>
    </BusinessContainer>
  );
};

export default BusinessIndonesian; 