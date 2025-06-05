import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './pages/Home';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import ProficiencyTest from './pages/ProficiencyTest';
import UserManager from './utils/userManager';

// 全局样式容器
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.main`
  padding-top: 70px; /* Header height */
`;

// 路由保护组件
function ProtectedRoute({ children }) {
  const isLoggedIn = UserManager.isLoggedIn();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// 登录路由保护（已登录用户访问登录页面时重定向到首页）
function LoginRoute({ children }) {
  const isLoggedIn = UserManager.isLoggedIn();
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    // 应用启动时的初始化
    console.log('Bahasa Beraja - Indonesian Language Learning App');
    
    // 检查用户登录状态
    const currentUser = UserManager.getCurrentUser();
    if (currentUser) {
      console.log(`Welcome back, ${currentUser.displayName}!`);
    }
  }, []);

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            {/* 登录路由 */}
            <Route 
              path="/login" 
              element={
                <LoginRoute>
                  <Login />
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
              path="/proficiency-test" 
              element={
                <ProtectedRoute>
                  <ProficiencyTest />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 