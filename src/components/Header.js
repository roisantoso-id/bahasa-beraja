import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, User, LogOut, Settings, BarChart, Menu, X } from 'lucide-react';
import UserManager from '../utils/userManager';
import UpdateManager from '../utils/updateManager';

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

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: 768px) {
    height: 60px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: #333;

  @media (max-width: 768px) {
    gap: 10px;
  }
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

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContent = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: white;
  padding: 20px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;

  @media (max-width: 480px) {
    width: 100vw;
    padding: 15px;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

const MobileMenuClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  display: block;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  ${props => props.$active && `
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    font-weight: 600;
  `}

  @media (max-width: 768px) {
    padding: 15px 16px;
    font-size: 16px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const UserInfo = styled.div`
  position: relative;

  @media (max-width: 768px) {
    order: -1;
  }
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

  @media (max-width: 768px) {
    padding: 6px 8px;
    gap: 8px;
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

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
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

  @media (max-width: 768px) {
    position: static;
    margin-top: 0;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background: transparent;
    min-width: auto;
    width: 100%;
  }
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

  @media (max-width: 768px) {
    padding: 15px 16px;
    font-size: 16px;
    border-radius: 12px;
    margin-bottom: 5px;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    &:last-child {
      border-top: none;
      border: 1px solid #fecaca;
      background: #fef2f2;
      color: #dc2626;

      &:hover {
        background: #fee2e2;
      }
    }
  }
`;

const DevDropdownItem = styled(DropdownItem)`
  color: #667eea;
  font-size: 12px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background: rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const UserStats = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8fafc;

  @media (max-width: 768px) {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 12px;
    margin-bottom: 15px;
    border: none;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
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

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  // 关闭移动端菜单
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    UserManager.logout();
    setCurrentUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate('/login');
  };

  const handleResetUpdate = () => {
    UpdateManager.resetUpdateStatus();
    setShowDropdown(false);
    setShowMobileMenu(false);
    // 刷新页面以触发更新检查
    window.location.reload();
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/vocabulary', label: '词汇学习' },
    { path: '/vocabulary-book', label: '我的生词本' },
    { path: '/grammar', label: '语法学习' },
    { path: '/quiz', label: '练习测验' },
    { path: '/business', label: '商务印尼语' }
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>
            <Book size={20} />
          </LogoIcon>
          <LogoText>Belajar Bahasa</LogoText>
        </Logo>

        {currentUser && (
          <DesktopNav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </DesktopNav>
        )}

        <UserSection>
          {currentUser ? (
            <>
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
                      
                      <DevDropdownItem onClick={handleResetUpdate}>
                        🔄 重置更新状态 (Dev)
                      </DevDropdownItem>
                      
                      <DropdownItem onClick={handleLogout}>
                        <LogOut size={16} />
                        退出登录
                      </DropdownItem>
                    </UserDropdown>
                  )}
                </AnimatePresence>
              </UserInfo>
              
              <MobileMenuButton onClick={() => setShowMobileMenu(true)}>
                <Menu size={24} color="#667eea" />
              </MobileMenuButton>
            </>
          ) : (
            <LoginButton to="/login">
              <User size={16} />
              登录
            </LoginButton>
          )}
        </UserSection>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <MobileMenuOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMobileMenu}
              />
              <MobileMenuContent
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <MobileMenuHeader>
                  <Logo to="/" onClick={closeMobileMenu}>
                    <LogoIcon>
                      <Book size={16} />
                    </LogoIcon>
                    <span style={{ fontSize: '18px', fontWeight: '700' }}>Belajar Bahasa</span>
                  </Logo>
                  <MobileMenuClose onClick={closeMobileMenu}>
                    <X size={24} color="#667eea" />
                  </MobileMenuClose>
                </MobileMenuHeader>

                {currentUser && (
                  <>
                    <MobileNav>
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          $active={location.pathname === item.path}
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </MobileNav>

                    <UserDropdown>
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

                      <DropdownItem onClick={closeMobileMenu}>
                        <Settings size={16} />
                        设置
                      </DropdownItem>
                      
                      <DropdownItem onClick={closeMobileMenu}>
                        <BarChart size={16} />
                        学习统计
                      </DropdownItem>
                      
                      <DevDropdownItem onClick={handleResetUpdate}>
                        🔄 重置更新状态 (Dev)
                      </DevDropdownItem>
                      
                      <DropdownItem onClick={handleLogout}>
                        <LogOut size={16} />
                        退出登录
                      </DropdownItem>
                    </UserDropdown>
                  </>
                )}
              </MobileMenuContent>
            </>
          )}
        </AnimatePresence>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 