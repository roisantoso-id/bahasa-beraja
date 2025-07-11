import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// CORS配置
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 模拟用户数据存储
const users: any[] = [];
let userIdCounter = 1;

// 用户注册接口
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, display_name } = req.body;

    // 验证必填字段
    if (!username || !display_name) {
      return res.status(400).json({
        success: false,
        message: '用户名和昵称是必填项'
      });
    }

    // 检查用户名是否已存在
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
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
      role: 'user',
      status: 'active',
      balance: 0,
      vip_level: 0,
      login_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);

    // 模拟JWT令牌
    const token = `mock-jwt-token-${newUser.id}`;
    const refreshToken = `mock-refresh-token-${newUser.id}`;

    res.status(201).json({
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
          last_login_at: new Date()
        },
        token,
        refresh_token: refreshToken
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登录接口
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码是必填项'
      });
    }

    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 模拟密码验证（实际应该使用bcrypt）
    if (password !== '123456') {
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
    const token = `mock-jwt-token-${user.id}`;
    const refreshToken = `mock-refresh-token-${user.id}`;

    res.status(200).json({
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
    console.error('登录失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户信息接口
app.get('/api/user/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    // 模拟令牌验证
    const userId = parseInt(token.replace('mock-jwt-token-', ''));
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }

    res.status(200).json({
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
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 健康检查端点
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PiMiBahasa API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 根路径
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '欢迎使用 PiMiBahasa API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 PiMiBahasa API 服务器启动成功`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log(`📝 测试账号: username=testuser, password=123456`);
});

export default app; 