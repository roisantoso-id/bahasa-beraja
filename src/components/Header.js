import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, User, LogOut, Settings, BarChart } from 'lucide-react';
import UserManager from '../utils/userManager';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: #333;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  ${props => props.$active && `
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$color || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 200px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-top: 1px solid #e1e5e9;
    color: #dc2626;
  }
`;

const UserStats = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8fafc;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  color: #666;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: #333;
`;

const LoginButton = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    // 检查用户登录状态
    const user = UserManager.getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      // 获取用户统计数据
      const stats = UserManager.getUserStats();
      setUserStats(stats);
    }
  }, [location]);

  const handleLogout = () => {
    UserManager.logout();
    setCurrentUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/vocabulary', label: '词汇学习' },
    { path: '/grammar', label: '语法学习' },
    { path: '/quiz', label: '练习测验' }
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>
            <Book size={20} />
          </LogoIcon>
          <LogoText>Bahasa Beraja</LogoText>
        </Logo>

        {currentUser && (
          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>
        )}

        <UserSection>
          {currentUser ? (
            <UserInfo>
              <UserButton onClick={() => setShowDropdown(!showDropdown)}>
                <UserAvatar $color={UserManager.getUserAvatarColor(currentUser.username)}>
                  {UserManager.getUserAvatarLetter(currentUser.username)}
                </UserAvatar>
                <UserName>{currentUser.displayName}</UserName>
              </UserButton>

              <AnimatePresence>
                {showDropdown && (
                  <UserDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserStats>
                      <StatRow>
                        <StatLabel>用户名</StatLabel>
                        <StatValue>{currentUser.username}</StatValue>
                      </StatRow>
                      <StatRow>
                        <StatLabel>注册时间</StatLabel>
                        <StatValue>
                          {new Date(currentUser.createdAt).toLocaleDateString()}
                        </StatValue>
                      </StatRow>
                      <StatRow>
                        <StatLabel>登录次数</StatLabel>
                        <StatValue>{currentUser.loginCount || 0}</StatValue>
                      </StatRow>
                    </UserStats>

                    <DropdownItem onClick={() => setShowDropdown(false)}>
                      <Settings size={16} />
                      设置
                    </DropdownItem>
                    
                    <DropdownItem onClick={() => setShowDropdown(false)}>
                      <BarChart size={16} />
                      学习统计
                    </DropdownItem>
                    
                    <DropdownItem onClick={handleLogout}>
                      <LogOut size={16} />
                      退出登录
                    </DropdownItem>
                  </UserDropdown>
                )}
              </AnimatePresence>
            </UserInfo>
          ) : (
            <LoginButton to="/login">
              <User size={16} />
              登录
            </LoginButton>
          )}
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 