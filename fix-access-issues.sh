#!/bin/bash

set -e

echo "🔧 修复 Bahasa Beraja 访问问题..."
echo "=================================="

# 1. 确保Docker服务运行
echo "1. 确保Docker服务运行..."
if ! systemctl is-active --quiet docker; then
    echo "启动Docker服务..."
    sudo systemctl start docker
    sleep 3
fi

# 2. 停止所有相关容器
echo ""
echo "2. 停止所有相关容器..."
docker stop bahasa-beraja-nginx-proxy 2>/dev/null || true
docker stop bahasa-beraja-app-dev 2>/dev/null || true
docker stop bahasa-beraja-api-dev 2>/dev/null || true
docker rm bahasa-beraja-nginx-proxy 2>/dev/null || true
docker rm bahasa-beraja-app-dev 2>/dev/null || true
docker rm bahasa-beraja-api-dev 2>/dev/null || true

# 3. 确保网络存在
echo ""
echo "3. 确保Docker网络存在..."
docker network create bahasa_app_network 2>/dev/null || true
docker network create bahasa_db_network 2>/dev/null || true

# 4. 启动前端和API服务
echo ""
echo "4. 启动前端和API服务..."
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 5. 检查前端服务是否正常
echo ""
echo "5. 检查前端服务..."
if docker exec bahasa-beraja-app-dev curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ 前端服务正常运行"
else
    echo "❌ 前端服务异常，检查日志..."
    docker logs bahasa-beraja-app-dev --tail 20
fi

# 6. 启动Nginx代理
echo ""
echo "6. 启动Nginx代理..."
docker-compose -f nginx-docker-compose.yml up -d

# 等待Nginx启动
sleep 5

# 7. 检查Nginx配置
echo ""
echo "7. 检查Nginx配置..."
if docker exec bahasa-beraja-nginx-proxy nginx -t >/dev/null 2>&1; then
    echo "✅ Nginx配置正确"
else
    echo "❌ Nginx配置错误"
    docker exec bahasa-beraja-nginx-proxy nginx -t
fi

# 8. 测试容器间连通性
echo ""
echo "8. 测试容器间连通性..."
if docker exec bahasa-beraja-nginx-proxy ping -c 1 bahasa-beraja-app-dev >/dev/null 2>&1; then
    echo "✅ Nginx可以ping通前端容器"
else
    echo "❌ Nginx无法ping通前端容器"
fi

if docker exec bahasa-beraja-nginx-proxy curl -s http://bahasa-beraja-app-dev:3000 >/dev/null 2>&1; then
    echo "✅ Nginx可以访问前端服务"
else
    echo "❌ Nginx无法访问前端服务"
fi

# 9. 检查端口监听
echo ""
echo "9. 检查端口监听..."
if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    echo "✅ 端口80正在监听"
else
    echo "❌ 端口80未监听"
fi

# 10. 测试本地访问
echo ""
echo "10. 测试本地访问..."
if curl -s http://localhost >/dev/null 2>&1; then
    echo "✅ 本地访问正常"
else
    echo "❌ 本地访问失败"
fi

echo ""
echo "=================================="
echo "🔧 修复完成"
echo ""
echo "🌐 现在可以尝试访问："
echo "   - http://www.pimibahasa.com"
echo "   - http://<你的服务器IP>"
echo ""
echo "💡 如果仍有问题，请运行 ./diagnose-access.sh 进行详细诊断" 