# 🧪 Belajar Bahasa 测试环境

## 📝 概述

这是 Belajar Bahasa 印尼语学习应用的测试环境配置，运行在端口 **2999**，与生产环境完全隔离。

## 🚀 快速启动

### 启动测试环境
```bash
./deploy-test.sh
```

### 停止测试环境
```bash
./stop-test.sh
```

### 手动操作
```bash
# 启动
docker-compose -f docker-compose.test.yml up -d

# 停止
docker-compose -f docker-compose.test.yml down

# 查看日志
docker logs bahasa-beraja-test

# 查看容器状态
docker ps | grep bahasa-beraja-test
```

## 🌐 访问地址

- **本地访问**: http://localhost:2999
- **服务器访问**: http://31.97.66.59:2999

## ⚙️ 环境配置

### 测试环境特性
- 端口: **2999** (与生产环境 3000 隔离)
- 容器名: `bahasa-beraja-test`
- 网络: `bahasa-test-network` (独立网络)
- 环境变量: `NODE_ENV=development`, `REACT_APP_ENV=test`
- Traefik: 禁用 (不会被生产代理)

### 与生产环境的区别
| 项目 | 生产环境 | 测试环境 |
|------|----------|----------|
| 端口 | 3000 | **2999** |
| 容器名 | bahasa-beraja-app | **bahasa-beraja-test** |
| 网络 | tools_network | **test_network** |
| NODE_ENV | production | **development** |
| Traefik | 启用 | **禁用** |

## 🔧 开发调试

### 查看实时日志
```bash
docker logs -f bahasa-beraja-test
```

### 进入容器调试
```bash
docker exec -it bahasa-beraja-test sh
```

### 重新构建
```bash
docker-compose -f docker-compose.test.yml build --no-cache
docker-compose -f docker-compose.test.yml up -d
```

## 📋 测试流程

1. **启动测试环境**
   ```bash
   ./deploy-test.sh
   ```

2. **访问应用**
   - 浏览器打开: http://31.97.66.59:2999

3. **测试功能**
   - 用户注册/登录
   - 词汇学习
   - 测验功能
   - 生词本
   - 移动端响应式

4. **查看日志**
   ```bash
   docker logs bahasa-beraja-test
   ```

5. **停止测试**
   ```bash
   ./stop-test.sh
   ```

## 🛡️ 安全隔离

- ✅ 独立的网络空间
- ✅ 不同的端口号
- ✅ 禁用生产代理
- ✅ 环境标签标识
- ✅ 独立的容器名称

## 🚨 注意事项

1. **不要在生产服务器上运行测试环境超过必要时间**
2. **测试完成后及时停止容器**
3. **测试数据不会影响生产环境**
4. **端口2999仅用于测试，不要对外开放**

## 📞 故障排除

### 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep :2999

# 强制停止占用进程
sudo kill -9 $(sudo lsof -t -i:2999)
```

### 容器启动失败
```bash
# 查看详细错误
docker-compose -f docker-compose.test.yml logs

# 清理并重新构建
docker-compose -f docker-compose.test.yml down
docker system prune -f
./deploy-test.sh
```

### 无法访问
1. 检查防火墙设置
2. 确认容器状态: `docker ps`
3. 查看容器日志: `docker logs bahasa-beraja-test`

---

## 🎯 测试完成后

记得执行清理：
```bash
./stop-test.sh
```

选择清理镜像以释放磁盘空间。 