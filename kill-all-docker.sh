#!/bin/bash

echo "💀 强制停止所有Docker容器..."

# 启动Docker
sudo systemctl start docker
sleep 2

# 强制停止所有容器
echo "停止所有容器..."
docker kill $(docker ps -q) 2>/dev/null || echo "没有运行中的容器"

# 显示结果
echo ""
echo "当前容器状态："
docker ps -a

echo "✅ 完成" 