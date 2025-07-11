import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

// 导入数据库配置
import { testConnection } from './config/database';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true
}));

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15分钟
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // 限制每个IP 15分钟内最多100个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  }
});
app.use('/api/', limiter);

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PiMiBahasa API',
      version: '1.0.0',
      description: 'PiMiBahasa 印尼语学习平台后端API文档',
      contact: {
        name: 'PiMiBahasa Team',
        email: 'support@pimibahasa.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(swaggerOptions);

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PiMiBahasa API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '欢迎使用 PiMiBahasa API',
    version: '1.0.0',
    documentation: `/api-docs`
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

// 全局错误处理中间件
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('全局错误:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || '服务器内部错误',
    ...(process.env['NODE_ENV'] === 'development' && { stack: error.stack })
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 PiMiBahasa API 服务器启动成功`);
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`📚 API文档: http://localhost:${PORT}/api-docs`);
      console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
      console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
startServer();

export default app; 