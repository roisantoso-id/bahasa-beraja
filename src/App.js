import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import VocabularyBook from './pages/VocabularyBook';
import Grammar from './pages/Grammar';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import BusinessIndonesian from './pages/BusinessIndonesian';
import UpdateModal from './components/UpdateModal';
import UserManager from './utils/userManager';
import UpdateManager from './utils/updateManager';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import { gradients } from './utils/theme';

// 全局样式容器
const AppContainer = styled.div`
  min-height: 100vh;
  background: ${gradients.background};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  padding-top: 70px; /* Header height */

  @media (max-width: 768px) {
    padding-top: 60px; /* Mobile header height */
  }
`;

// 路由保护组件
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      加载中...
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 登录路由保护（已登录用户访问登录页面时重定向到首页）
function LoginRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      加载中...
    </div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const location = window.location.pathname;

  useEffect(() => {
    // 应用启动时的初始化
    console.log('Belajar Bahasa - Indonesian Language Learning App');
    
    // 检查用户登录状态
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
      console.log(`Welcome back, ${currentUser.displayName}!`);
      
      // 检查是否需要显示更新弹窗（仅对已登录用户）
      if (UpdateManager.shouldShowUpdateModal()) {
        // 延迟1秒显示，让页面完全加载
        setTimeout(() => {
          setShowUpdateModal(true);
        }, 1000);
      }
    }
  }, []);

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          {location !== '/login' && <Header />}
          <MainContent>
            <Routes>
                          {/* 登录路由 */}
            <Route 
              path="/login" 
              element={
                <LoginRoute>
                  <LoginForm />
                </LoginRoute>
              } 
            />
            
            {/* 注册路由 */}
            <Route 
              path="/register" 
              element={
                <LoginRoute>
                  <RegisterForm />
                </LoginRoute>
              } 
            />
              
              {/* 受保护的路由 */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vocabulary" 
                element={
                  <ProtectedRoute>
                    <Vocabulary />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vocabulary-book" 
                element={
                  <ProtectedRoute>
                    <VocabularyBook />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/grammar" 
                element={
                  <ProtectedRoute>
                    <Grammar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz" 
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business" 
                element={
                  <ProtectedRoute>
                    <BusinessIndonesian />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 重定向 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainContent>

          {/* 更新弹窗 */}
          {showUpdateModal && <UpdateModal onClose={handleCloseUpdateModal} />}
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App; 