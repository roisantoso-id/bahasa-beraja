#!/bin/bash

echo "🔍 Business Bahasa 部署问题诊断工具"
echo "=================================="

# 检查Docker状态
echo "1. 检查Docker状态..."
if docker info > /dev/null 2>&1; then
    echo "✅ Docker正在运行"
else
    echo "❌ Docker未运行，请启动Docker服务"
    exit 1
fi

# 检查Docker Compose
echo "2. 检查Docker Compose..."
if docker compose version > /dev/null 2>&1; then
    echo "✅ Docker Compose可用"
else
    echo "❌ Docker Compose不可用"
    exit 1
fi

# 检查端口占用
echo "3. 检查端口占用..."
for port in 8081 8082 8083 8084 8085; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  端口 $port 被占用: $(lsof -Pi :$port -sTCP:LISTEN)"
    else
        echo "✅ 端口 $port 可用"
    fi
done

# 检查文件
echo "4. 检查必要文件..."
files=("package.json" "Dockerfile" "docker-compose.yml" "next.config.mjs")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 缺失"
    fi
done

# 检查容器状态
echo "5. 检查现有容器..."
if docker compose ps 2>/dev/null | grep -q "business-bahasa"; then
    echo "📊 现有容器状态:"
    docker compose ps
else
    echo "ℹ️  没有运行中的business-bahasa容器"
fi

# 清理建议
echo "6. 清理建议..."
echo "🧹 运行以下命令清理:"
echo "   docker compose down --remove-orphans"
echo "   docker system prune -f"
echo "   docker builder prune -f"

# 重新部署建议
echo "7. 重新部署建议..."
echo "🚀 运行以下命令重新部署:"
echo "   ./deploy.sh"

echo ""
echo "📋 如果问题持续，请检查:"
echo "   - Docker日志: docker compose logs"
echo "   - 构建日志: docker compose build --no-cache"
echo "   - 系统资源: docker system df" 