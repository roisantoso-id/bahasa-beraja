const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS配置
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://168.231.118.179',
    'http://168.231.118.179:80',
    'http://168.231.118.179:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`📥 请求头:`, req.headers);
  console.log(`📥 请求体:`, req.body);
  next();
});

// 模拟用户数据存储
const users = [];
let userIdCounter = 1;

// 健康检查接口
app.get('/health', (req, res) => {
  console.log('🏥 健康检查请求');
  res.json({
    success: true,
    message: 'PiMiBahasa API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    users_count: users.length
  });
});

// 用户注册接口
app.post('/api/auth/register', (req, res) => {
  console.log('🔐 注册请求开始');
  try {
    const { username, email, display_name, password } = req.body;
    console.log('🔐 注册参数:', { username, email, display_name, password: password ? '***' : 'undefined' });

    // 验证必填字段
    if (!username || !display_name) {
      console.log('❌ 注册失败: 缺少必填字段');
      return res.status(400).json({
        success: false,
        message: '用户名和昵称是必填项'
      });
    }

    // 检查用户名是否已存在
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      console.log('❌ 注册失败: 用户名已存在');
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 创建新用户
    const newUser = {
      id: userIdCounter++,
      username,
      email: email || undefined,
      display_name,
      password: password || '123456', // 默认密码
      role: 'user',
      status: 'active',
      balance: 0,
      vip_level: 0,
      login_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);
    console.log('✅ 注册成功:', { id: newUser.id, username: newUser.username, display_name: newUser.display_name });
    console.log('📊 当前用户总数:', users.length);

    return res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          display_name: newUser.display_name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          balance: newUser.balance,
          vip_level: newUser.vip_level,
          login_count: newUser.login_count,
          created_at: newUser.created_at
        }
      }
    });
  } catch (error) {
    console.error('❌ 注册异常:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录接口
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 登录请求开始');
  try {
    const { username, password } = req.body;
    console.log('🔐 登录参数:', { username, password: password ? '***' : 'undefined' });

    // 验证必填字段
    if (!username || !password) {
      console.log('❌ 登录失败: 缺少必填字段');
      return res.status(400).json({
        success: false,
        message: '用户名和密码是必填项'
      });
    }

    // 查找用户
    const user = users.find(u => u.username === username);
    console.log('🔍 查找用户结果:', user ? `找到用户ID: ${user.id}` : '用户不存在');
    
    if (!user) {
      console.log('❌ 登录失败: 用户不存在');
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 模拟密码验证（实际应该使用bcrypt）
    const isPasswordValid = password === '123456' || password === user.password;
    console.log('🔐 密码验证:', isPasswordValid ? '密码正确' : '密码错误');
    
    if (!isPasswordValid) {
      console.log('❌ 登录失败: 密码错误');
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 更新登录信息
    user.login_count += 1;
    user.last_login_at = new Date();
    user.updated_at = new Date();

    // 模拟JWT令牌
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;

    console.log('✅ 登录成功:', { 
      userId: user.id, 
      username: user.username, 
      loginCount: user.login_count,
      token: token.substring(0, 20) + '...'
    });

    return res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          role: user.role,
          status: user.status,
          balance: user.balance,
          vip_level: user.vip_level,
          login_count: user.login_count,
          last_login_at: user.last_login_at
        },
        token,
        refresh_token: refreshToken
      }
    });
  } catch (error) {
    console.error('❌ 登录异常:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户信息接口
app.get('/api/user/profile', (req, res) => {
  console.log('👤 获取用户信息请求开始');
  try {
    const authHeader = req.headers.authorization;
    console.log('🔑 认证头:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ 获取用户信息失败: 缺少认证头');
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }

    const token = authHeader.substring(7);
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // 从token中提取用户ID（模拟JWT解析）
    const userIdMatch = token.match(/mock-jwt-token-(\d+)/);
    if (!userIdMatch) {
      console.log('❌ 获取用户信息失败: Token格式错误');
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    const userId = parseInt(userIdMatch[1]);
    console.log('🔍 从Token提取的用户ID:', userId);

    const user = users.find(u => u.id === userId);
    if (!user) {
      console.log('❌ 获取用户信息失败: 用户不存在');
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    console.log('✅ 获取用户信息成功:', { userId: user.id, username: user.username });

    return res.status(200).json({
      success: true,
      message: '获取用户信息成功',
      data: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role: user.role,
        status: user.status,
        balance: user.balance,
        vip_level: user.vip_level,
        login_count: user.login_count,
        last_login_at: user.last_login_at,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('❌ 获取用户信息异常:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取所有用户接口（调试用）
app.get('/api/debug/users', (req, res) => {
  console.log('🔍 调试: 获取所有用户');
  res.json({
    success: true,
    message: '调试信息',
    data: {
      total_users: users.length,
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        display_name: u.display_name,
        login_count: u.login_count
      }))
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 PiMiBahasa API 服务器启动成功');
  console.log('📍 服务地址:', `http://localhost:${PORT}`);
  console.log('🔍 健康检查:', `http://localhost:${PORT}/health`);
  console.log('⏰ 启动时间:', new Date().toLocaleString());
  console.log('📝 测试账号: username=testuser, password=123456');
  console.log('🔧 调试接口: /api/debug/users');
  
  // 创建默认测试用户
  const testUser = {
    id: userIdCounter++,
    username: 'testuser',
    email: 'test@example.com',
    display_name: '测试用户',
    password: '123456',
    role: 'user',
    status: 'active',
    balance: 0,
    vip_level: 0,
    login_count: 0,
    created_at: new Date(),
    updated_at: new Date()
  };
  users.push(testUser);
  console.log('👤 已创建默认测试用户:', testUser.username);
}); 