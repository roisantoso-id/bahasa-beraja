# Business Bahasa 部署指南

## 概述
本指南将帮助您使用 Docker Compose 部署 Business Bahasa 应用。

## 系统要求
- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 5GB 可用磁盘空间

## 快速部署

### 1. 克隆项目
```bash
git clone <repository-url>
cd bussiness_bahasa
```

### 2. 运行部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. 访问应用
部署成功后，访问: http://localhost:8081

## 手动部署

### 1. 构建镜像
```bash
docker compose build --no-cache
```

### 2. 启动服务
```bash
docker compose up -d
```

### 3. 检查状态
```bash
docker compose ps
```

## 管理服务

### 停止服务
```bash
./stop.sh
# 或者
docker compose down
```

### 查看日志
```bash
docker compose logs -f
```

### 重启服务
```bash
docker compose restart
```

## 故障排除

### 常见问题

#### 1. 端口冲突
如果端口 8081 被占用，部署脚本会自动尝试其他端口 (8082-8085)。

**手动解决:**
```bash
# 检查端口占用
lsof -i :8081

# 修改 docker-compose.yml 中的端口映射
# 将 "8081:8081" 改为 "8082:8081"
```

#### 2. Docker 构建失败
如果遇到依赖安装问题：

**解决方案:**
```bash
# 清理 Docker 缓存
docker system prune -f
docker builder prune -f

# 重新构建
docker compose build --no-cache
```

#### 3. 内存不足
如果遇到内存不足错误：

**解决方案:**
```bash
# 增加 Docker 内存限制
# 在 Docker Desktop 设置中增加内存分配

# 或者使用 swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 4. 权限问题
如果遇到权限错误：

**解决方案:**
```bash
# 确保脚本有执行权限
chmod +x deploy.sh stop.sh troubleshoot.sh

# 使用 sudo 运行 Docker 命令
sudo docker compose up -d
```

### 诊断工具

运行诊断脚本检查系统状态：
```bash
./troubleshoot.sh
```

### 日志分析

#### 查看应用日志
```bash
docker compose logs business-bahasa
```

#### 查看构建日志
```bash
docker compose build --no-cache --progress=plain
```

#### 查看系统资源
```bash
docker system df
docker stats
```

## 环境变量

可以通过环境变量自定义配置：

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - PORT=8081
  - HOSTNAME=0.0.0.0
  - NEXT_TELEMETRY_DISABLED=1
```

## 生产环境建议

### 1. 使用反向代理
建议在生产环境中使用 Nginx 或 Traefik 作为反向代理。

### 2. 配置 SSL
为生产环境配置 HTTPS 证书。

### 3. 监控
设置容器监控和日志收集。

### 4. 备份
定期备份应用数据和配置。

## 更新应用

### 1. 拉取最新代码
```bash
git pull origin main
```

### 2. 重新部署
```bash
./deploy.sh
```

## 清理

### 完全清理
```bash
# 停止并删除容器
docker compose down --volumes --remove-orphans

# 删除镜像
docker rmi business-bahasa_business-bahasa

# 清理系统
docker system prune -af
```

## 联系支持

如果遇到问题，请：
1. 运行 `./troubleshoot.sh` 收集诊断信息
2. 查看日志文件
3. 联系技术支持团队

---

**注意:** 本应用使用 Next.js 15.2.4 和 React 19，确保您的环境兼容这些版本。 