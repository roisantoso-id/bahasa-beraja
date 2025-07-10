#!/bin/bash

echo "🧪 简单Nginx测试"
echo "================"

# 启动Docker
sudo systemctl start docker
sleep 2

# 清理旧容器
docker stop test-nginx 2>/dev/null || true
docker rm test-nginx 2>/dev/null || true

# 启动nginx
echo "启动nginx容器..."
docker run -d --name test-nginx -p 9000:80 nginx:alpine

echo "等待容器启动..."
sleep 3

# 检查状态
echo "容器状态:"
docker ps | grep test-nginx

echo ""
echo "端口监听:"
netstat -tlnp | grep :9000 || echo "端口9000未监听"

echo ""
echo "测试访问:"
curl -I http://localhost:9000 2>/dev/null || echo "本地访问失败"

echo ""
echo "🌐 请尝试访问:"
echo "   http://localhost:9000"
echo "   http://$(curl -s ifconfig.me 2>/dev/null || echo '你的服务器IP'):9000" 