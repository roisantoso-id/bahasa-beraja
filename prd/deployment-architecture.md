# PiMiBahasa 部署架构设计

## 1. 整体架构

### 1.1 服务架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户浏览器     │    │   移动端应用     │    │   第三方服务     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Nginx 反向代理        │
                    │      (端口 80/443)        │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│   前端 React 应用   │  │   后端 API 服务   │  │   phpMyAdmin      │
│   (端口 3000)     │  │   (端口 3001)     │  │   (端口 8081)     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Redis 缓存           │
                    │      (端口 6379)          │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      MySQL 数据库         │
                    │      (端口 3306)          │
                    └───────────────────────────┘
```

### 1.2 容器化部署
- **前端容器**: React应用，独立部署
- **后端容器**: Node.js API服务，独立部署
- **数据库容器**: MySQL 8.0，数据持久化
- **缓存容器**: Redis，会话和缓存存储
- **管理容器**: phpMyAdmin，数据库管理

## 2. 服务配置

### 2.1 前端服务 (React)
```yaml
# docker-compose.frontend.yml
version: '3.8'
services:
  frontend:
    build: .
    container_name: pimi_bahasa_frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://168.231.118.179:3001
      - REACT_APP_ENV=production
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    networks:
      - pimi_network
```

### 2.2 后端服务 (Node.js)
```yaml
# docker-compose.backend.yml
version: '3.8'
services:
  backend:
    build: ./backend
    container_name: pimi_bahasa_backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=pimi_user
      - DB_PASSWORD=pimi_pass_2024
      - DB_NAME=pimi_bahasa
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - mysql
      - redis
    networks:
      - pimi_network
```

### 2.3 Redis 缓存服务
```yaml
# docker-compose.redis.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: pimi_bahasa_redis
    ports:
      - "6379:6379"
    volumes:
      - /home/data/pimi_bahasa_redis:/data
    command: redis-server --appendonly yes
    networks:
      - pimi_network
```

## 3. Nginx 配置

### 3.1 反向代理配置
```nginx
# /etc/nginx/sites-available/pimi-bahasa
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name 168.231.118.179;
    
    # 前端应用
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 后端API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.2 SSL 配置 (可选)
```nginx
server {
    listen 443 ssl http2;
    server_name 168.231.118.179;
    
    ssl_certificate /etc/ssl/certs/pimi-bahasa.crt;
    ssl_certificate_key /etc/ssl/private/pimi-bahasa.key;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # 其他配置同上...
}
```

## 4. 环境变量配置

### 4.1 前端环境变量
```env
# .env.production
REACT_APP_API_URL=http://168.231.118.179:3001
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0
```

### 4.2 后端环境变量
```env
# backend/.env.production
NODE_ENV=production
PORT=3001

# 数据库配置
DB_HOST=mysql
DB_PORT=3306
DB_USER=pimi_user
DB_PASSWORD=pimi_pass_2024
DB_NAME=pimi_bahasa

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 日志配置
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 5. 数据持久化

### 5.1 数据目录结构
```
/home/data/
├── pimi_bahasa_mysql/     # MySQL数据
├── pimi_bahasa_redis/     # Redis数据
├── pimi_bahasa_logs/      # 应用日志
└── pimi_bahasa_backups/   # 备份文件
```

### 5.2 备份策略
```bash
#!/bin/bash
# backup-all.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/data/pimi_bahasa_backups"

# 备份MySQL
docker exec pimi_bahasa_mysql mysqldump -u pimi_user -ppimi_pass_2024 pimi_bahasa > "$BACKUP_DIR/mysql_backup_$DATE.sql"

# 备份Redis
docker exec pimi_bahasa_redis redis-cli BGSAVE
cp /home/data/pimi_bahasa_redis/dump.rdb "$BACKUP_DIR/redis_backup_$DATE.rdb"

# 压缩备份
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "mysql_backup_$DATE.sql" "redis_backup_$DATE.rdb"

# 清理旧备份 (保留7天)
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
```

## 6. 监控和日志

### 6.1 应用日志
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pimi-bahasa-api' },
  transports: [
    new winston.transports.File({ 
      filename: '/home/data/pimi_bahasa_logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: '/home/data/pimi_bahasa_logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 6.2 健康检查
```typescript
// backend/src/routes/health.ts
import { Router } from 'express';
import { sequelize } from '../config/database';
import { redis } from '../config/redis';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // 检查数据库连接
    await sequelize.authenticate();
    
    // 检查Redis连接
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'running'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
```

## 7. 部署脚本

### 7.1 完整部署脚本
```bash
#!/bin/bash
# deploy.sh

echo "🚀 开始部署 PiMiBahasa..."

# 1. 停止现有服务
echo "📦 停止现有服务..."
docker-compose -f docker-compose.yml down

# 2. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 3. 构建镜像
echo "🔨 构建镜像..."
docker-compose -f docker-compose.yml build

# 4. 启动服务
echo "🚀 启动服务..."
docker-compose -f docker-compose.yml up -d

# 5. 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 6. 健康检查
echo "🔍 健康检查..."
curl -f http://localhost:3001/health || exit 1

echo "✅ 部署完成！"
echo "🌐 访问地址: http://168.231.118.179"
```

### 7.2 回滚脚本
```bash
#!/bin/bash
# rollback.sh

if [ $# -eq 0 ]; then
    echo "请指定要回滚的版本标签"
    exit 1
fi

VERSION=$1
echo "🔄 回滚到版本: $VERSION"

# 1. 停止服务
docker-compose down

# 2. 切换到指定版本
git checkout $VERSION

# 3. 重新构建和启动
docker-compose build
docker-compose up -d

echo "✅ 回滚完成！"
```

## 8. 性能优化

### 8.1 Nginx 性能优化
```nginx
# nginx.conf
worker_processes auto;
worker_connections 1024;

# 启用gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### 8.2 数据库优化
```sql
-- 优化查询
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vocabulary_user_category ON vocabulary_mastery(user_id, category_id);

-- 分区表 (可选)
ALTER TABLE quiz_history PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);
```

---

**文档版本**: v1.0  
**创建时间**: 2024-07-11  
**负责人**: 运维团队 