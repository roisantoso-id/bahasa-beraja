import http from '../utils/http';
import { API_ENDPOINTS } from '../config/api';

// 认证相关API
export const authAPI = {
  // 用户注册
  async register(userData) {
    // 转换字段名以匹配后端API
    const registerData = {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      display_name: userData.displayName || userData.display_name
    };
    
    console.log('🔐 注册请求数据:', registerData);
    const result = await http.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
    console.log('🔐 注册响应:', result);
    return result;
  },
  
  // 用户登录
  async login(credentials) {
    console.log('🔐 登录请求数据:', credentials);
    const result = await http.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('🔐 登录响应:', result);
    return result;
  },
  
  // 刷新令牌
  async refreshToken(refreshToken) {
    return http.post(API_ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken });
  },
  
  // 登出（清除本地存储）
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  // 保存认证信息
  saveAuth(authData) {
    if (authData.token) {
      localStorage.setItem('token', authData.token);
    }
    if (authData.refresh_token) {
      localStorage.setItem('refresh_token', authData.refresh_token);
    }
    if (authData.user) {
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
  },
  
  // 获取当前用户信息
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // 检查是否已登录
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  async getProfile() {
    return http.get(API_ENDPOINTS.USER.PROFILE);
  },
  
  // 更新用户信息
  async updateProfile(userData) {
    return http.put(API_ENDPOINTS.USER.UPDATE_PROFILE, userData);
  },
  
  // 更新头像
  async updateAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    return http.upload('/api/user/avatar', formData);
  },
};

// 系统相关API
export const systemAPI = {
  // 健康检查
  async healthCheck() {
    return http.get(API_ENDPOINTS.SYSTEM.HEALTH);
  },
};

// 统一导出
export default {
  auth: authAPI,
  user: userAPI,
  system: systemAPI,
}; 