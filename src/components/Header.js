import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Book, User, LogOut, Settings, BarChart, Menu, X } from 'lucide-react';
import UserManager from '../utils/userManager';
import UpdateManager from '../utils/updateManager';
import ArtisticLogo from './ArtisticLogo';

import { gradients, colors } from '../utils/theme';

const PRIMARY_GRADIENT = gradients.primary;
const PRIMARY = colors.primary;
const PRIMARY_DARK = colors.primaryDark;

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

  &:hover {
    background: rgba(180, 138, 74, 0.08);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenuOverlay = styled.div`
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

const MobileMenuContent = styled.div`
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

  &:hover {
    background: rgba(180, 138, 74, 0.08);
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
  position: relative;
  display: block;

  &:hover {
    color: ${PRIMARY_DARK};
    background: rgba(99, 102, 241, 0.08);
  }

  ${props => props.$active && `
    color: ${PRIMARY_DARK};
    background: rgba(99, 102, 241, 0.1);
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
  background: ${props => props.$color || PRIMARY_DARK};
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

const UserDropdown = styled.div`
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
  color: ${PRIMARY_DARK};
  font-size: 12px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background: rgba(99, 102, 241, 0.1);
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
  background: ${PRIMARY_GRADIENT};
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
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
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
          <ArtisticLogo />
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

                {showDropdown && (
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
              </UserInfo>
              
              <MobileMenuButton onClick={() => setShowMobileMenu(true)}>
                <Menu size={24} color={PRIMARY_DARK} />
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
        {showMobileMenu && (
          <>
            <MobileMenuOverlay onClick={closeMobileMenu} />
            <MobileMenuContent>
              <MobileMenuHeader>
                <Logo to="/" onClick={closeMobileMenu}>
                  <ArtisticLogo />
                </Logo>
                <MobileMenuClose onClick={closeMobileMenu}>
                  <X size={24} color={PRIMARY_DARK} />
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
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 