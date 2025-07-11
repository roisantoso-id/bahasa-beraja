#!/bin/bash

# 设置错误时退出
set -e

echo "🚀 开始部署 Business Bahasa 应用..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker服务"
    exit 1
fi

# 检查Docker Compose是否可用
if ! docker compose version > /dev/null 2>&1; then
    echo "❌ Docker Compose不可用，请检查安装"
    exit 1
fi

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  端口 $port 已被占用"
        return 1
    else
        echo "✅ 端口 $port 可用"
        return 0
    fi
}

# 检查8081端口
if ! check_port 8081; then
    echo "🔍 尝试查找可用端口..."
    for port in 8082 8083 8084 8085; do
        if check_port $port; then
            echo "📝 将使用端口 $port 替代 8081"
            # 更新docker-compose.yml中的端口
            sed -i "s/8081:8081/$port:8081/" docker-compose.yml
            sed -i "s/- \"8081:8081\"/- \"$port:8081\"/" docker-compose.yml
            break
        fi
    done
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker compose down --remove-orphans 2>/dev/null || true

# 清理旧的构建缓存
echo "🧹 清理构建缓存..."
docker builder prune -f 2>/dev/null || true

# 构建并启动
echo "🔨 构建Docker镜像..."
docker compose build --no-cache

echo "⏳ 启动服务..."
docker compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if docker compose ps | grep -q "Up"; then
    echo "✅ 部署成功！"
    echo "🌐 应用地址: http://localhost:8081"
    echo "📊 容器状态:"
    docker compose ps
    echo ""
    echo "📋 查看日志: docker compose logs -f"
    echo "🛑 停止服务: ./stop.sh"
else
    echo "❌ 部署失败，请检查日志:"
    docker compose logs
    exit 1
fi 