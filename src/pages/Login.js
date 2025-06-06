import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, LogIn, UserPlus, Book } from 'lucide-react';
import UserManager from '../utils/userManager';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleMode = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  width: 100%;
  padding: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: #5a67d8;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  border-left: 4px solid #ef4444;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  border-left: 4px solid #10b981;
`;

const RecentUsers = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
`;

const RecentUsersTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
`;

const UserItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: #f8fafc;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;

  &:hover {
    background: #f1f5f9;
    border-color: #667eea;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const UserMeta = styled.div`
  font-size: 12px;
  color: #666;
`;

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [recentUsers, setRecentUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否已登录
    if (UserManager.isLoggedIn()) {
      navigate('/');
      return;
    }

    // 加载最近的用户
    const users = UserManager.getAllUsers();
    const usersList = Object.values(users)
      .sort((a, b) => new Date(b.lastLoginAt) - new Date(a.lastLoginAt))
      .slice(0, 3);
    setRecentUsers(usersList);
  }, [navigate]);

  const showMessage = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      showMessage('请输入用户名');
      return;
    }

    setLoading(true);

    try {
      const result = UserManager.login(username.trim(), displayName.trim());
      
      if (result.success) {
        showMessage(
          result.user.loginCount === 1 
            ? `欢迎加入 Belajar Bahasa，${result.user.displayName}！` 
            : `欢迎回来，${result.user.displayName}！`,
          'success'
        );
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        showMessage(result.message);
      }
    } catch (error) {
      showMessage('登录过程中发生错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setLoading(true);
    
    const result = UserManager.login(user.username, user.displayName);
    
    if (result.success) {
      showMessage(`欢迎回来，${result.user.displayName}！`, 'success');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      showMessage(result.message);
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <LogoIcon>
            <Book size={24} />
          </LogoIcon>
          <LogoText>Belajar Bahasa</LogoText>
        </Logo>

        <Title>{isLogin ? '登录账户' : '创建账户'}</Title>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {messageType === 'success' ? (
              <SuccessMessage>{message}</SuccessMessage>
            ) : (
              <ErrorMessage>{message}</ErrorMessage>
            )}
          </motion.div>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel>用户名</InputLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              disabled={loading}
              autoFocus
            />
          </InputGroup>

          {!isLogin && (
            <InputGroup>
              <InputLabel>显示名称（可选）</InputLabel>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="请输入显示名称"
                disabled={loading}
              />
            </InputGroup>
          )}

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              '处理中...'
            ) : isLogin ? (
              <>
                <LogIn size={20} />
                登录
              </>
            ) : (
              <>
                <UserPlus size={20} />
                注册
              </>
            )}
          </LoginButton>
        </Form>

        <ToggleMode onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '还没有账户？点击注册' : '已有账户？点击登录'}
        </ToggleMode>

        {recentUsers.length > 0 && (
          <RecentUsers>
            <RecentUsersTitle>快速登录</RecentUsersTitle>
            <UsersList>
              {recentUsers.map((user) => (
                <UserItem
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  disabled={loading}
                >
                  <UserAvatar $color={UserManager.getUserAvatarColor(user.username)}>
                    {UserManager.getUserAvatarLetter(user.username)}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.displayName}</UserName>
                    <UserMeta>
                      登录 {user.loginCount} 次 • 
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </UserMeta>
                  </UserInfo>
                </UserItem>
              ))}
            </UsersList>
          </RecentUsers>
        )}
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 