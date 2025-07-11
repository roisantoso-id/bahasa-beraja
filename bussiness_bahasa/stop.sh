#!/bin/bash

# 停止商务印尼语应用
echo "🛑 停止商务印尼语应用..."

# 停止容器
docker-compose down

# 清理容器和网络
echo "🧹 清理容器和网络..."
docker-compose down --remove-orphans

# 可选：清理镜像
read -p "是否清理镜像？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ 清理镜像..."
    docker system prune -f
fi

echo "✅ 应用已停止！" 