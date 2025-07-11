# PiMiBahasa 后端服务架构设计

## 1. 技术栈选择

### 1.1 核心框架
- **Node.js**: v18+ (LTS版本)
- **Express.js**: 高性能Web框架
- **TypeScript**: 类型安全开发

### 1.2 数据库相关
- **MySQL 8.0**: 主数据库
- **Sequelize**: ORM框架
- **Redis**: 缓存和会话存储

### 1.3 认证安全
- **JWT**: JSON Web Token认证
- **bcrypt**: 密码加密
- **helmet**: 安全中间件
- **cors**: 跨域处理

### 1.4 开发工具
- **ESLint**: 代码规范
- **Prettier**: 代码格式化
- **Jest**: 单元测试
- **Swagger**: API文档

## 2. 项目结构

```
backend/
├── src/
│   ├── config/           # 配置文件
│   │   ├── database.ts   # 数据库配置
│   │   ├── redis.ts      # Redis配置
│   │   └── jwt.ts        # JWT配置
│   ├── models/           # 数据模型
│   │   ├── User.ts       # 用户模型
│   │   ├── Vocabulary.ts # 词汇模型
│   │   └── Quiz.ts       # 测验模型
│   ├── controllers/      # 控制器
│   │   ├── auth.ts       # 认证控制器
│   │   ├── user.ts       # 用户控制器
│   │   └── migration.ts  # 迁移控制器
│   ├── middleware/       # 中间件
│   │   ├── auth.ts       # 认证中间件
│   │   ├── validation.ts # 验证中间件
│   │   └── error.ts      # 错误处理
│   ├── routes/           # 路由
│   │   ├── auth.ts       # 认证路由
│   │   ├── user.ts       # 用户路由
│   │   └── migration.ts  # 迁移路由
│   ├── services/         # 业务逻辑
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── migrationService.ts
│   ├── utils/            # 工具函数
│   │   ├── logger.ts     # 日志工具
│   │   ├── crypto.ts     # 加密工具
│   │   └── validator.ts  # 验证工具
│   └── app.ts            # 应用入口
├── tests/                # 测试文件
├── docs/                 # API文档
├── docker/               # Docker配置
├── package.json
├── tsconfig.json
└── .env.example
```

## 3. 数据库模型设计

### 3.1 用户模型 (User)
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  avatar_url?: string;
  phone?: string;
  country: string;
  language: string;
  timezone: string;
  status: 'active' | 'disabled' | 'pending';
  role: 'user' | 'vip' | 'admin' | 'super_admin';
  email_verified: boolean;
  phone_verified: boolean;
  balance: number;
  vip_level: number;
  vip_expire_at?: Date;
  total_recharge: number;
  total_consumption: number;
  login_count: number;
  last_login_at?: Date;
  total_study_time: number;
  streak_days: number;
  longest_streak: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
```

### 3.2 会话模型 (UserSession)
```typescript
interface UserSession {
  id: number;
  user_id: number;
  token: string;
  refresh_token: string;
  expires_at: Date;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}
```

## 4. API 接口设计

### 4.1 认证接口

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "display_name": "string"
}

Response:
{
  "success": true,
  "data": {
    "user": User,
    "token": "string",
    "refresh_token": "string"
  }
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "data": {
    "user": User,
    "token": "string",
    "refresh_token": "string"
  }
}
```

### 4.2 用户数据接口

#### 获取用户信息
```
GET /api/user/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "user": User
  }
}
```

#### 更新用户信息
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "display_name": "string",
  "avatar_url": "string"
}

Response:
{
  "success": true,
  "data": {
    "user": User
  }
}
```

### 4.3 数据迁移接口

#### 导入localStorage数据
```
POST /api/migration/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "vocabulary_mastery": object,
  "quiz_history": array,
  "learning_stats": object
}

Response:
{
  "success": true,
  "data": {
    "migrated_items": number,
    "status": "completed"
  }
}
```

## 5. 中间件设计

### 5.1 认证中间件
```typescript
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 5.2 错误处理中间件
```typescript
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};
```

## 6. 安全配置

### 6.1 JWT配置
```typescript
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m',
  refreshExpiresIn: '7d'
};
```

### 6.2 密码加密
```typescript
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

## 7. 性能优化

### 7.1 数据库连接池
```typescript
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
});
```

### 7.2 Redis缓存
```typescript
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});
```

## 8. 部署配置

### 8.1 Docker配置
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 8.2 环境变量
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=pimi_user
DB_PASSWORD=pimi_pass_2024
DB_NAME=pimi_bahasa

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=production
```

## 9. 监控和日志

### 9.1 日志配置
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 9.2 健康检查
```typescript
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

---

**文档版本**: v1.0  
**创建时间**: 2024-07-11  
**负责人**: 后端开发团队 