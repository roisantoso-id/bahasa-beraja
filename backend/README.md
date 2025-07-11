# PiMiBahasa Backend API

PiMiBahasa 印尼语学习平台的后端API服务，基于 Node.js + Express + TypeScript + MySQL 构建。

## 🚀 功能特性

- ✅ 用户注册和登录
- ✅ JWT认证和授权
- ✅ 用户信息管理
- ✅ 数据库持久化存储
- ✅ API文档自动生成
- ✅ 安全防护机制
- ✅ Docker容器化部署
- ✅ 健康检查监控

## 📋 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL 8.0
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **加密**: bcryptjs
- **验证**: Joi
- **文档**: Swagger/OpenAPI
- **容器化**: Docker
- **安全**: Helmet, CORS, Rate Limiting

## 🏗️ 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── controllers/     # 控制器层
│   │   └── userController.ts
│   ├── middleware/      # 中间件
│   │   └── auth.ts      # JWT认证中间件
│   ├── models/          # 数据模型
│   │   └── User.ts      # 用户模型
│   ├── routes/          # 路由定义
│   │   ├── auth.ts      # 认证路由
│   │   └── user.ts      # 用户路由
│   ├── services/        # 业务逻辑层
│   │   └── userService.ts
│   ├── utils/           # 工具函数
│   ├── app.ts           # 主应用文件
│   └── health-check.ts  # 健康检查
├── tests/               # 测试文件
├── docs/                # 文档
│   └── API.md           # API接口文档
├── docker/              # Docker配置
│   └── Dockerfile
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript配置
├── env.example          # 环境变量示例
└── README.md            # 项目说明
```

## 🛠️ 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0+
- Docker (可选)

### 1. 克隆项目

```bash
git clone <repository-url>
cd bahasa-beraja/backend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量示例文件：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息：

```env
# 服务器配置
NODE_ENV=development
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=pimi_user
DB_PASSWORD=pimi_pass_2024
DB_NAME=pimi_bahasa

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 安全配置
CORS_ORIGIN=http://localhost:3000
```

### 4. 数据库准备

确保MySQL服务已启动，并创建数据库：

```sql
CREATE DATABASE pimi_bahasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pimi_user'@'localhost' IDENTIFIED BY 'pimi_pass_2024';
GRANT ALL PRIVILEGES ON pimi_bahasa.* TO 'pimi_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. 启动服务

#### 开发模式

```bash
npm run dev
```

#### 生产模式

```bash
npm run build
npm start
```

### 6. 验证服务

访问以下地址验证服务是否正常：

- 服务状态: http://localhost:3001/health
- API文档: http://localhost:3001/api-docs
- 根路径: http://localhost:3001/

## 🐳 Docker部署

### 构建镜像

```bash
docker build -t pimi-bahasa-backend .
```

### 运行容器

```bash
docker run -d \
  --name pimi-backend \
  -p 3001:3001 \
  --env-file .env \
  pimi-bahasa-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## 📚 API文档

### 在线文档

启动服务后，访问 http://localhost:3001/api-docs 查看Swagger在线文档。

### 离线文档

详细API接口文档请参考 [docs/API.md](./docs/API.md)。

## 🔧 开发指南

### 代码规范

项目使用ESLint和Prettier进行代码规范检查：

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 代码格式化
npm run format
```

### 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch
```

### 数据库迁移

```bash
# 同步数据库结构
npx sequelize-cli db:sync

# 运行迁移
npx sequelize-cli db:migrate

# 回滚迁移
npx sequelize-cli db:migrate:undo
```

## 🔒 安全特性

- **JWT认证**: 使用JWT进行用户认证
- **密码加密**: 使用bcryptjs加密用户密码
- **CORS保护**: 配置跨域请求限制
- **Helmet安全头**: 设置安全相关的HTTP头
- **速率限制**: 防止API滥用
- **输入验证**: 使用Joi进行数据验证
- **SQL注入防护**: 使用Sequelize ORM

## 📊 监控和日志

### 健康检查

服务提供健康检查端点：`GET /health`

### 日志记录

使用Winston进行日志记录，支持不同级别的日志输出。

## 🚀 部署

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 配置强密码的JWT密钥
3. 使用HTTPS
4. 配置反向代理（如Nginx）
5. 设置数据库连接池
6. 配置日志轮转

### 性能优化

- 启用数据库连接池
- 使用Redis缓存
- 启用Gzip压缩
- 配置CDN
- 数据库索引优化

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目维护者: PiMiBahasa Team
- 邮箱: support@pimibahasa.com
- 项目地址: [GitHub Repository]

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！ 