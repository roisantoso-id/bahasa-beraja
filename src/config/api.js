// API配置文件
// 支持开发、测试、生产环境的不同配置

const getApiBaseUrl = () => {
  // 直接使用后端IP地址，避免代理问题
  const apiHost = process.env.REACT_APP_API_HOST || '168.231.118.179';
  const apiPort = process.env.REACT_APP_API_PORT || '3001';
  
  console.log('🔧 API配置:', `${apiHost}:${apiPort}`);
  return `http://${apiHost}:${apiPort}`;
};

// API基础配置
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10秒超时
  RETRY_TIMES: 3, // 重试次数
};

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
  },
  
  // 用户相关
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
  },
  
  // 系统相关
  SYSTEM: {
    HEALTH: '/health',
  },
};

// 获取完整的API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 环境信息
export const ENV_INFO = {
  NODE_ENV: process.env.NODE_ENV,
  API_HOST: process.env.REACT_APP_API_HOST || 'localhost',
  API_PORT: process.env.REACT_APP_API_PORT || '3001',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
};

console.log('🔧 API配置信息:', {
  BASE_URL: API_CONFIG.BASE_URL,
  ENV: ENV_INFO.NODE_ENV,
  API_HOST: ENV_INFO.API_HOST,
  API_PORT: ENV_INFO.API_PORT,
}); 