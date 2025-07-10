#!/bin/bash

set -e

echo "🧪 测试Nginx镜像访问..."
echo "=========================="

# 启动Docker服务
echo "1. 启动Docker服务..."
sudo systemctl start docker
sleep 3

# 检查Docker状态
echo "2. 检查Docker状态..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker服务正在运行"
else
    echo "❌ Docker服务启动失败"
    exit 1
fi

# 停止并删除之前的测试容器
echo "3. 清理之前的测试容器..."
docker stop test-nginx 2>/dev/null || true
docker rm test-nginx 2>/dev/null || true

# 启动测试nginx容器
echo "4. 启动测试Nginx容器..."
docker run -d --name test-nginx -p 9000:80 nginx:alpine

sleep 2

# 检查容器状态
echo "5. 检查容器状态..."
if docker ps | grep -q "test-nginx"; then
    echo "✅ 测试Nginx容器正在运行"
else
    echo "❌ 测试Nginx容器启动失败"
    exit 1
fi

# 检查端口监听
echo "6. 检查端口9000监听状态..."
if netstat -tlnp 2>/dev/null | grep -q ":9000 "; then
    echo "✅ 端口9000正在监听"
else
    echo "❌ 端口9000未监听"
fi

# 测试本地访问
echo "7. 测试本地访问..."
if curl -s http://localhost:9000 >/dev/null 2>&1; then
    echo "✅ 本地访问成功"
else
    echo "❌ 本地访问失败"
fi

# 获取服务器IP
echo "8. 获取服务器IP..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "无法获取IP")
echo "服务器IP: $SERVER_IP"

echo ""
echo "=========================="
echo "🧪 测试完成"
echo ""
echo "🌐 现在你可以尝试访问："
echo "   - 本地: http://localhost:9000"
echo "   - 外部: http://$SERVER_IP:9000"
echo ""
echo "💡 如果外部访问失败，请检查："
echo "   1. 防火墙设置: sudo ufw status"
echo "   2. 云服务器安全组设置"
echo "   3. 端口9000是否开放"
echo ""
echo "🔧 清理测试容器: docker stop test-nginx && docker rm test-nginx" 