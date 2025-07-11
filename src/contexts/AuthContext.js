import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初始化时检查登录状态
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser && authAPI.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        authAPI.saveAuth(response.data);
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      if (response.success) {
        authAPI.saveAuth(response.data);
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || '注册失败');
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setError(null);
  };

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      // 如果获取用户信息失败，可能是token过期，执行登出
      logout();
    }
  };

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext; 