import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import UserManager from '../utils/userManager';
import ArtisticLogo from '../components/ArtisticLogo';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6366f1;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #e1e5e9;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LogoSubtitle = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 500;
  margin-top: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  padding-left: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  color: #333;
  outline: none;

  &:focus {
    border-color: #6366f1;
  }

  &::placeholder {
    color: #999;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const DemoSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
`;

const DemoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const DemoButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  color: #6366f1;
  border: 2px solid #6366f1;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
`;

const DemoInfo = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.4;
`;

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await UserManager.login(formData.username, formData.password);
      if (result.success) {
        setSuccess('登录成功！正在跳转...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(result.message || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      setError('登录过程中发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await UserManager.login('demo', 'demo123');
      if (result.success) {
        setSuccess('演示账号登录成功！正在跳转...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError('演示账号登录失败');
      }
    } catch (err) {
      setError('演示账号登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <ArtisticLogo />
          <LogoSubtitle>Indonesian Language Learning Platform</LogoSubtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="用户名 / Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="密码 / Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录 / Login'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>

        <DemoSection>
          <DemoTitle>演示账号 / Demo Account</DemoTitle>
          <DemoButton onClick={handleDemoLogin} disabled={isLoading}>
            使用演示账号登录 / Login with Demo Account
          </DemoButton>
          <DemoInfo>
            用户名: demo<br/>
            密码: demo123<br/>
            Username: demo<br/>
            Password: demo123
          </DemoInfo>
        </DemoSection>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 