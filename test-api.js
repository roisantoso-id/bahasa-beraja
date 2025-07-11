#!/usr/bin/env node

// API测试脚本
// 使用内置的 fetch (Node.js 18+)

const API_BASE = 'http://localhost:3001';

// 测试数据
const testUser = {
  username: 'testuser',
  password: '123456',
  email: 'test@example.com',
  displayName: '测试用户'
};

const testCredentials = {
  username: 'testuser',
  password: '123456'
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

// 测试函数
async function testAPI() {
  log(colors.blue, '🚀 开始测试 PiMiBahasa API...\n');

  try {
    // 1. 健康检查
    log(colors.yellow, '1. 测试健康检查...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.success) {
      log(colors.green, '✅ 健康检查通过');
      console.log(`   响应: ${healthData.message}`);
    } else {
      log(colors.red, '❌ 健康检查失败');
    }

    // 2. 用户注册
    log(colors.yellow, '\n2. 测试用户注册...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    
    if (registerData.success) {
      log(colors.green, '✅ 用户注册成功');
      console.log(`   用户ID: ${registerData.data.user.id}`);
    } else {
      log(colors.red, '❌ 用户注册失败');
      console.log(`   错误: ${registerData.message}`);
    }

    // 3. 用户登录
    log(colors.yellow, '\n3. 测试用户登录...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      log(colors.green, '✅ 用户登录成功');
      console.log(`   Token: ${loginData.data.token.substring(0, 20)}...`);
      
      // 4. 获取用户信息
      log(colors.yellow, '\n4. 测试获取用户信息...');
      const profileResponse = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        log(colors.green, '✅ 获取用户信息成功');
        console.log(`   用户名: ${profileData.data.username}`);
        console.log(`   显示名: ${profileData.data.displayName}`);
      } else {
        log(colors.red, '❌ 获取用户信息失败');
        console.log(`   错误: ${profileData.message}`);
      }
      
    } else {
      log(colors.red, '❌ 用户登录失败');
      console.log(`   错误: ${loginData.message}`);
    }

    log(colors.blue, '\n🎉 API测试完成！');

  } catch (error) {
    log(colors.red, `❌ 测试过程中发生错误: ${error.message}`);
    console.error(error);
  }
}

// 运行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 