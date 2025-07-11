import { API_CONFIG, getApiUrl } from '../config/api';

// 请求拦截器
const requestInterceptor = (config) => {
  // 添加认证头
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  // 添加默认头
  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers,
  };
  
  return config;
};

// 响应拦截器
const responseInterceptor = async (response) => {
  console.log('🌐 响应状态:', response.status, response.statusText);
  console.log('🌐 响应头:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    // 处理401未授权
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      // 可以在这里触发重新登录
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
    }
    
    // 处理其他错误
    const errorData = await response.json().catch(() => ({}));
    console.error('🌐 响应错误:', errorData);
    throw new Error(errorData.message || `请求失败: ${response.status}`);
  }
  
  const responseData = await response.json();
  console.log('🌐 响应数据:', responseData);
  return responseData;
};

// 重试机制
const retryRequest = async (url, options, retryCount = 0) => {
  try {
    console.log(`🌐 发起请求 (第${retryCount + 1}次):`, url);
    const response = await fetch(url, options);
    return await responseInterceptor(response);
  } catch (error) {
    console.error(`🌐 请求异常 (第${retryCount + 1}次):`, error);
    if (retryCount < API_CONFIG.RETRY_TIMES) {
      console.log(`🌐 请求失败，重试第${retryCount + 1}次:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return retryRequest(url, options, retryCount + 1);
    }
    throw error;
  }
};

// 主要HTTP请求函数
export const http = {
  // GET请求
  async get(endpoint, options = {}) {
    const config = requestInterceptor({
      method: 'GET',
      ...options,
    });
    
    const url = getApiUrl(endpoint);
    console.log('🌐 GET请求:', url, config);
    return retryRequest(url, config);
  },
  
  // POST请求
  async post(endpoint, data = {}, options = {}) {
    const config = requestInterceptor({
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
    
    const url = getApiUrl(endpoint);
    console.log('🌐 POST请求:', url);
    console.log('🌐 请求数据:', data);
    console.log('🌐 请求配置:', config);
    return retryRequest(url, config);
  },
  
  // PUT请求
  async put(endpoint, data = {}, options = {}) {
    const config = requestInterceptor({
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
    
    const url = getApiUrl(endpoint);
    return retryRequest(url, config);
  },
  
  // DELETE请求
  async delete(endpoint, options = {}) {
    const config = requestInterceptor({
      method: 'DELETE',
      ...options,
    });
    
    const url = getApiUrl(endpoint);
    return retryRequest(url, config);
  },
  
  // 文件上传
  async upload(endpoint, formData, options = {}) {
    const config = requestInterceptor({
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置
      },
      ...options,
    });
    
    const url = getApiUrl(endpoint);
    return retryRequest(url, config);
  },
};

// 错误处理工具
export const handleApiError = (error) => {
  console.error('API请求错误:', error);
  
  // 根据错误类型返回用户友好的消息
  if (error.message.includes('网络')) {
    return '网络连接失败，请检查网络设置';
  }
  
  if (error.message.includes('超时')) {
    return '请求超时，请稍后重试';
  }
  
  if (error.message.includes('登录已过期')) {
    return '登录已过期，请重新登录';
  }
  
  return error.message || '请求失败，请稍后重试';
};

// 导出默认实例
export default http; 