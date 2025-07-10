# Bahasa Beraja 项目架构说明

## 🎯 架构重构概述

为了支持频繁的代码更新和更好的模块化管理，项目已重构为**前端和数据库分离**的架构。

## 📁 项目结构

```
bahasa-beraja/
├── 📦 前端相关
│   ├── docker-compose.yml      # 前端服务配置 (React + API)
│   ├── start-frontend.sh       # 前端启动脚本
│   ├── src/                    # React 源码
│   ├── backend/                # Node.js API 服务
│   └── nginx.conf              # 前端服务器配置
│
├── 🗄️ 数据库相关
│   ├── database/
│   │   ├── docker-compose.yml  # 数据库服务配置
│   │   ├── init-db.sql         # 数据库初始化脚本
│   │   ├── upgrade-db.sql      # 数据库升级脚本
│   │   └── README.md           # 详细数据库配置文档
│   └── start-database.sh       # 数据库启动脚本
│
├── ⚙️ 管理脚本
│   ├── start-database.sh       # 启动数据库服务
│   ├── start-frontend.sh       # 启动前端服务
│   └── stop-all.sh             # 停止所有服务
│
└── 📚 文档
    ├── README-架构说明.md      # 本文档
    └── prd/                    # 产品需求文档
```

## 🚀 快速开始

### 方式一：分步启动（推荐开发时使用）

1. **启动数据库服务**
   ```bash
   ./start-database.sh
   ```

2. **启动前端服务**
   ```bash
   ./start-frontend.sh
   ```

### 方式二：传统方式

```bash
# 先启动数据库
cd database
docker-compose up -d
cd ..

# 再启动前端
docker-compose up -d
```

### 停止所有服务

```bash
./stop-all.sh
```

## 🌐 服务端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端应用 | 2999 | React 应用界面 |
| API 服务 | 3001 | 后端 API 接口 |
| PostgreSQL | 5432 | 数据库服务 |
| pgAdmin | 5050 | 数据库管理界面 |

## 🔗 网络架构

```mermaid
graph TB
    A[前端 React App :2999] --> B[API 服务 :3001]
    B --> C[PostgreSQL :5432]
    D[pgAdmin :5050] --> C
    
    subgraph "bahasa_app_network"
        A
        B
    end
    
    subgraph "bahasa_db_network"
        C
        D
    end
    
    B -.->|外部网络连接| C
```

## 💾 数据持久化

所有数据保存在 `/home/data/` 目录：
- PostgreSQL 数据：`/home/data/bahasa-beraja-postgres/`
- pgAdmin 配置：`/home/data/bahasa-beraja-pgadmin/`

## 🔧 开发工作流

### 前端开发
1. 确保数据库服务运行：`./start-database.sh`
2. 停止前端服务：`docker-compose down`
3. 修改代码
4. 重启前端：`docker-compose up -d`

### 后端 API 开发
后端代码有热重载，修改 `backend/` 目录下的文件会自动生效，无需重启容器。

### 数据库修改
1. 修改 `database/` 目录下的 SQL 脚本
2. 重启数据库服务：
   ```bash
   cd database
   docker-compose down
   docker-compose up -d
   ```

## 🎛️ 环境变量配置

### 前端 (docker-compose.yml)
```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgresql://bahasa_user:bahasa_pass_2024@postgres:5432/bahasa_beraja
```

### API 服务
```yaml
environment:
  - DB_HOST=postgres
  - DB_PORT=5432
  - DB_NAME=bahasa_beraja
  - DB_USER=bahasa_user
  - DB_PASSWORD=bahasa_pass_2024
  - JWT_SECRET=bahasa-beraja-super-secret-jwt-key-2024-indonesian-learning
```

### 数据库 (database/docker-compose.yml)
```yaml
environment:
  - POSTGRES_DB=bahasa_beraja
  - POSTGRES_USER=bahasa_user
  - POSTGRES_PASSWORD=bahasa_pass_2024
```

## 📊 监控和调试

### 查看服务状态
```bash
# 查看前端服务
docker-compose ps

# 查看数据库服务
cd database
docker-compose ps
```

### 查看日志
```bash
# 前端服务日志
docker-compose logs -f bahasa-beraja-app
docker-compose logs -f bahasa-beraja-api

# 数据库服务日志
cd database
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

### 连接数据库调试
```bash
# 直接连接 PostgreSQL
docker exec -it bahasa-beraja-db psql -U bahasa_user -d bahasa_beraja

# 通过 pgAdmin: http://localhost:5050
```

## 🔄 重新部署流程

### 完整重新部署
```bash
# 1. 停止所有服务
./stop-all.sh

# 2. 重新构建镜像（如果代码有更新）
docker-compose build --no-cache

# 3. 启动服务
./start-database.sh
./start-frontend.sh
```

### 仅重启前端
```bash
docker-compose down
docker-compose up -d
```

## 🚨 故障排除

### 网络连接问题
```bash
# 检查网络
docker network ls | grep bahasa

# 重新创建网络
docker network rm bahasa_db_network bahasa_app_network
./start-database.sh
./start-frontend.sh
```

### 容器名称冲突
```bash
# 删除冲突容器
docker rm -f bahasa-beraja-app bahasa-beraja-api bahasa-beraja-db bahasa-beraja-admin

# 重新启动
./start-database.sh
./start-frontend.sh
```

### 数据丢失问题
确保数据目录权限正确：
```bash
sudo chown 999:999 /home/data/bahasa-beraja-postgres
sudo chown 5050:5050 /home/data/bahasa-beraja-pgadmin
```

## 📚 相关文档

- **数据库详细配置**：`database/README.md`
- **API 接口文档**：`backend/README.md`
- **产品需求文档**：`prd/` 目录

## 💡 开发建议

1. **频繁代码更新**：只需重启前端服务，数据库保持运行
2. **数据库调试**：使用 pgAdmin (http://localhost:5050) 进行可视化管理
3. **版本控制**：数据库配置单独管理，便于不同环境部署
4. **性能监控**：通过 `docker stats` 监控容器资源使用

---

**架构设计**：前后端分离 + 数据库独立  
**最后更新**：2024年12月  
**版本**：v2.0 - 模块化架构 