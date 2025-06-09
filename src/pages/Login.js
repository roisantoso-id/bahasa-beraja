import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, LogIn, UserPlus, Book } from 'lucide-react';
import UserManager from '../utils/userManager';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: url('/assets/batik.jpg') center center/cover no-repeat;
    opacity: 0.18;
    z-index: 0;
    pointer-events: none;
  }
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 22px;
  padding: 40px 32px 32px 32px;
  box-shadow: 0 10px 32px rgba(180,138,74,0.08), 0 2px 8px rgba(0,0,0,0.06);
  border: 1.5px solid #f0f0f0;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
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
  background: #fff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b48a4a;
  overflow: hidden;
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
    border-color: #ff2e3c;
    box-shadow: 0 0 0 3px rgba(255,46,60,0.10);
  }

  &::placeholder {
    color: #999;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #fff;
  color: #b48a4a;
  border: 1.5px solid #e7cfa2;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.4,2,.6,1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: #f7f7f7;
    color: #b48a4a;
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 10px 20px #b48a4a18;
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
  color: #ff2e3c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  width: 100%;
  padding: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: #c62828;
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

// 印尼国徽 Garuda SVG
const GarudaSVG = () => (
  <motion.svg
    width="54" height="54" viewBox="0 0 64 64" fill="none"
    style={{marginBottom: 8}}
    animate={{ y: [0, -8, 0, 8, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  >
    <g>
      <path d="M8,32 Q2,18 18,18 Q8,8 24,12 Q18,2 32,8 Q46,2 40,12 Q56,8 46,18 Q62,18 56,32" stroke="#e7cfa2" strokeWidth="2" fill="none"/>
      <ellipse cx="32" cy="32" rx="10" ry="16" fill="#f7d774" stroke="#b48a4a" strokeWidth="2"/>
      <circle cx="32" cy="18" r="6" fill="#f7d774" stroke="#b48a4a" strokeWidth="2"/>
      <path d="M32,18 Q36,20 32,22" stroke="#b48a4a" strokeWidth="2" fill="none"/>
      <path d="M28,48 Q26,54 30,54" stroke="#b48a4a" strokeWidth="2" fill="none"/>
      <path d="M36,48 Q38,54 34,54" stroke="#b48a4a" strokeWidth="2" fill="none"/>
    </g>
  </motion.svg>
);

// 印尼 batik 波浪 SVG
const BatikWaveSVG = ({ style }) => (
  <svg width="100%" height="32" viewBox="0 0 360 32" fill="none" style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <pattern id="batikPatternLogin" patternUnits="userSpaceOnUse" width="60" height="32">
        <path d="M0,16 Q15,0 30,16 T60,16" stroke="#e7cfa2" strokeWidth="2" fill="none"/>
        <circle cx="15" cy="16" r="2.5" fill="#f7d774" opacity="0.7"/>
        <circle cx="45" cy="16" r="2.5" fill="#f7d774" opacity="0.7"/>
      </pattern>
    </defs>
    <rect width="360" height="32" fill="url(#batikPatternLogin)" />
  </svg>
);

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
            ? `欢迎加入 Bahasa Beraja，${result.user.displayName}！` 
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
      {/* 印尼人偶背景图 */}
      <img
        src={'/assets/indo.jpg'}
        alt="Indonesian Wayang"
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '60%',
          maxWidth: 600,
          minWidth: 320,
          opacity: 0.18,
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <LoginCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [50, 40, 50] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        style={{ zIndex: 1 }}
      >
        <div style={{ width: '100%', margin: '-32px -32px 12px -32px' }}>
          <BatikWaveSVG />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <GarudaSVG />
          <Logo>
            <LogoText>Bahasa Beraja</LogoText>
          </Logo>
          <div style={{ fontSize: 16, color: '#b48a4a', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
            Selamat datang di platform belajar bahasa Indonesia!
          </div>
        </div>

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
        <div style={{ width: '100%', margin: '24px -32px -32px -32px' }}>
          <BatikWaveSVG style={{ transform: 'rotate(180deg)' }} />
        </div>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login; 