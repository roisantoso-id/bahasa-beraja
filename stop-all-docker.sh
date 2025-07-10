#!/bin/bash

echo "🛑 停止所有Docker容器..."
echo "========================"

# 启动Docker服务
echo "1. 启动Docker服务..."
sudo systemctl start docker
sleep 2

# 检查Docker状态
if ! systemctl is-active --quiet docker; then
    echo "❌ Docker服务启动失败"
    exit 1
fi

echo "✅ Docker服务正在运行"

# 列出所有运行中的容器
echo ""
echo "2. 当前运行中的容器："
RUNNING_CONTAINERS=$(docker ps -q)
if [ -z "$RUNNING_CONTAINERS" ]; then
    echo "✅ 没有运行中的容器"
else
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

# 停止所有运行中的容器
echo ""
echo "3. 停止所有运行中的容器..."
if [ -n "$RUNNING_CONTAINERS" ]; then
    docker stop $RUNNING_CONTAINERS
    echo "✅ 所有容器已停止"
else
    echo "✅ 没有需要停止的容器"
fi

# 列出所有容器（包括已停止的）
echo ""
echo "4. 所有容器状态："
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "========================"
echo "✅ 操作完成"
echo ""
echo "💡 提示："
echo "   - 使用 'docker start <容器名>' 重新启动特定容器"
echo "   - 使用 'docker rm <容器名>' 删除已停止的容器"
echo "   - 使用 'docker system prune' 清理未使用的资源" 