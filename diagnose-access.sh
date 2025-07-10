#!/bin/bash

set -e

echo "🔍 诊断 Bahasa Beraja 访问问题..."
echo "=================================="

# 检查Docker服务状态
echo "1. 检查Docker服务状态..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker服务正在运行"
else
    echo "❌ Docker服务未运行，正在启动..."
    sudo systemctl start docker
    sleep 3
fi

# 检查容器状态
echo ""
echo "2. 检查容器状态..."
if docker ps | grep -q "bahasa-beraja-app-dev"; then
    echo "✅ 前端容器正在运行"
else
    echo "❌ 前端容器未运行"
fi

if docker ps | grep -q "bahasa-beraja-api-dev"; then
    echo "✅ API容器正在运行"
else
    echo "❌ API容器未运行"
fi

if docker ps | grep -q "bahasa-beraja-nginx-proxy"; then
    echo "✅ Nginx代理容器正在运行"
else
    echo "❌ Nginx代理容器未运行"
fi

# 检查网络
echo ""
echo "3. 检查Docker网络..."
if docker network ls | grep -q "bahasa_app_network"; then
    echo "✅ bahasa_app_network 网络存在"
else
    echo "❌ bahasa_app_network 网络不存在"
fi

if docker network ls | grep -q "bahasa_db_network"; then
    echo "✅ bahasa_db_network 网络存在"
else
    echo "❌ bahasa_db_network 网络不存在"
fi

# 检查端口监听
echo ""
echo "4. 检查端口监听状态..."
if netstat -tlnp 2>/dev/null | grep -q ":80 "; then
    echo "✅ 端口80正在监听"
else
    echo "❌ 端口80未监听"
fi

if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "✅ 端口3000正在监听"
else
    echo "❌ 端口3000未监听"
fi

# 检查容器间连通性
echo ""
echo "5. 检查容器间连通性..."
if docker ps | grep -q "bahasa-beraja-nginx-proxy" && docker ps | grep -q "bahasa-beraja-app-dev"; then
    echo "测试Nginx到前端的连通性..."
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
else
    echo "⚠️  无法测试连通性：容器未运行"
fi

# 检查Nginx配置
echo ""
echo "6. 检查Nginx配置..."
if [ -f "nginx-proxy.conf" ]; then
    echo "✅ nginx-proxy.conf 文件存在"
    echo "配置内容："
    cat nginx-proxy.conf
else
    echo "❌ nginx-proxy.conf 文件不存在"
fi

# 检查日志
echo ""
echo "7. 检查最近的服务日志..."
echo "前端容器日志（最近10行）："
docker logs --tail 10 bahasa-beraja-app-dev 2>/dev/null || echo "无法获取前端日志"

echo ""
echo "Nginx代理日志（最近10行）："
docker logs --tail 10 bahasa-beraja-nginx-proxy 2>/dev/null || echo "无法获取Nginx日志"

echo ""
echo "=================================="
echo "🔍 诊断完成"
echo ""
echo "💡 建议："
echo "1. 如果容器未运行，请运行 ./start-frontend.sh"
echo "2. 如果Nginx未运行，请运行 ./start-nginx-proxy.sh"
echo "3. 如果网络有问题，请重启所有服务"
echo "4. 检查防火墙设置：sudo ufw status"
echo "5. 检查DNS解析：nslookup www.pimibahasa.com" 