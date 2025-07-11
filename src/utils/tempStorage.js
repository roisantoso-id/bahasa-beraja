// 临时数据存储工具
// 用于未登录用户的临时数据管理

const TEMP_STORAGE_PREFIX = 'pimi_temp_';
const TEMP_DATA_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天过期

// 生成带时间戳的键名
const getKeyWithTimestamp = (key) => {
  return `${TEMP_STORAGE_PREFIX}${key}_${Date.now()}`;
};

// 获取所有临时数据的键
const getTempKeys = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(TEMP_STORAGE_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
};

// 清理过期的临时数据
const cleanupExpiredData = () => {
  const keys = getTempKeys();
  const now = Date.now();
  
  keys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && data.timestamp && (now - data.timestamp) > TEMP_DATA_EXPIRY) {
        localStorage.removeItem(key);
        console.log('🧹 清理过期临时数据:', key);
      }
    } catch (error) {
      // 如果数据格式错误，直接删除
      localStorage.removeItem(key);
      console.log('🧹 清理无效临时数据:', key);
    }
  });
};

// 存储临时数据
export const setTempData = (key, data) => {
  try {
    const tempData = {
      data,
      timestamp: Date.now(),
      key: key // 保存原始键名，便于后续处理
    };
    
    const storageKey = getKeyWithTimestamp(key);
    localStorage.setItem(storageKey, JSON.stringify(tempData));
    
    console.log('💾 存储临时数据:', key, data);
    return true;
  } catch (error) {
    console.error('❌ 存储临时数据失败:', error);
    return false;
  }
};

// 获取临时数据
export const getTempData = (key) => {
  try {
    const keys = getTempKeys();
    const targetKeys = keys.filter(k => {
      const data = JSON.parse(localStorage.getItem(k));
      return data && data.key === key;
    });
    
    if (targetKeys.length === 0) {
      return null;
    }
    
    // 返回最新的数据
    const latestKey = targetKeys[targetKeys.length - 1];
    const tempData = JSON.parse(localStorage.getItem(latestKey));
    
    console.log('📖 读取临时数据:', key, tempData.data);
    return tempData.data;
  } catch (error) {
    console.error('❌ 读取临时数据失败:', error);
    return null;
  }
};

// 获取所有临时数据
export const getAllTempData = () => {
  try {
    const keys = getTempKeys();
    const allData = {};
    
    keys.forEach(key => {
      const tempData = JSON.parse(localStorage.getItem(key));
      if (tempData && tempData.key) {
        if (!allData[tempData.key]) {
          allData[tempData.key] = [];
        }
        allData[tempData.key].push({
          data: tempData.data,
          timestamp: tempData.timestamp,
          storageKey: key
        });
      }
    });
    
    return allData;
  } catch (error) {
    console.error('❌ 获取所有临时数据失败:', error);
    return {};
  }
};

// 删除临时数据
export const removeTempData = (key) => {
  try {
    const keys = getTempKeys();
    const targetKeys = keys.filter(k => {
      const data = JSON.parse(localStorage.getItem(k));
      return data && data.key === key;
    });
    
    targetKeys.forEach(k => {
      localStorage.removeItem(k);
      console.log('🗑️ 删除临时数据:', k);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 删除临时数据失败:', error);
    return false;
  }
};

// 清理所有临时数据
export const clearAllTempData = () => {
  try {
    const keys = getTempKeys();
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🧹 清理所有临时数据');
    return true;
  } catch (error) {
    console.error('❌ 清理临时数据失败:', error);
    return false;
  }
};

// 检查是否有临时数据
export const hasTempData = (key) => {
  return getTempData(key) !== null;
};

// 获取临时数据统计
export const getTempDataStats = () => {
  const allData = getAllTempData();
  const stats = {
    totalKeys: Object.keys(allData).length,
    totalItems: 0,
    dataTypes: {}
  };
  
  Object.entries(allData).forEach(([key, items]) => {
    stats.totalItems += items.length;
    stats.dataTypes[key] = items.length;
  });
  
  return stats;
};

// 初始化时清理过期数据
cleanupExpiredData();

// 定期清理过期数据（每小时执行一次）
setInterval(cleanupExpiredData, 60 * 60 * 1000);

export default {
  setTempData,
  getTempData,
  getAllTempData,
  removeTempData,
  clearAllTempData,
  hasTempData,
  getTempDataStats
}; 