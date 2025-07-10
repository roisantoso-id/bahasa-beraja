const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { checkConnection } = require('./config/database');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 日志中间件
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// 全局限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP每15分钟最多100个请求
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// 健康检查端点
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await checkConnection();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '🇮🇩 Bahasa Beraja API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    code: 'NOT_FOUND'
  });
});

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error);

  // 数据库错误
  if (error.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'The resource already exists',
      code: 'DUPLICATE_ENTRY'
    });
  }

  // JWT错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'The provided token is invalid',
      code: 'INVALID_TOKEN'
    });
  }

  // 验证错误
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // 默认服务器错误
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    code: 'INTERNAL_ERROR'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 检查数据库连接
    const dbConnected = await checkConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // 启动HTTP服务器
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
🚀 Bahasa Beraja API Server Started!
📍 Server: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🗄️ Database: Connected
⏰ Started at: ${new Date().toISOString()}
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// 启动服务器
if (require.main === module) {
  startServer();
}

module.exports = app; 