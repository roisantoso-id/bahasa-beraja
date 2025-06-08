#!/bin/bash

echo "🛑 停止 Belajar Bahasa 测试环境..."

# 停止并移除测试容器
docker-compose -f docker-compose.test.yml down

# 清理测试网络（如果没有其他容器使用）
echo "🧹 清理测试网络..."
docker network ls | grep bahasa-test-network && docker network rm bahasa-test-network 2>/dev/null || true

# 清理测试镜像（可选）
read -p "是否要清理测试镜像? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 清理测试镜像..."
    docker image ls | grep bahasa-beraja-test && docker rmi $(docker images | grep bahasa-beraja-test | awk '{print $3}') 2>/dev/null || true
    docker image prune -f
fi

echo "✅ 测试环境已停止" 