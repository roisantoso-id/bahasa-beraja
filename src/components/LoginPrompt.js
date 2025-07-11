import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, BookOpen, BarChart } from 'lucide-react';

const LoginPromptContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  color: white;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PrimaryButton = styled(Button)`
  background: white;
  color: #667eea;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LoginPrompt = ({ 
  title = "登录后享受完整功能", 
  description = "登录后可以保存学习进度、查看个人统计、管理生词本等",
  showBenefits = true,
  onLogin,
  onRegister 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate('/login');
    }
  };

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      navigate('/register');
    }
  };

  return (
    <LoginPromptContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      
      {showBenefits && (
        <BenefitsList>
          <BenefitItem>
            <BookOpen size={20} />
            <span>保存学习进度和生词本</span>
          </BenefitItem>
          <BenefitItem>
            <BarChart size={20} />
            <span>查看个人学习统计</span>
          </BenefitItem>
          <BenefitItem>
            <UserPlus size={20} />
            <span>个性化学习体验</span>
          </BenefitItem>
        </BenefitsList>
      )}
      
      <ButtonGroup>
        <PrimaryButton onClick={handleLogin}>
          <LogIn size={18} />
          立即登录
        </PrimaryButton>
        <SecondaryButton onClick={handleRegister}>
          <UserPlus size={18} />
          注册账号
        </SecondaryButton>
      </ButtonGroup>
    </LoginPromptContainer>
  );
};

export default LoginPrompt; 