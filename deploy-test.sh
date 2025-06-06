#!/bin/bash

echo "🚀 启动 Belajar Bahasa 测试环境..."
echo "测试端口: 2999"
echo "环境: Test/Development"

# 停止并移除测试容器（如果存在）
echo "🔄 停止现有测试容器..."
docker-compose -f docker-compose.test.yml down

# 清理测试相关镜像
echo "🧹 清理旧的测试镜像..."
docker image prune -f

# 构建并启动测试环境
echo "📦 构建测试镜像..."
docker-compose -f docker-compose.test.yml build --no-cache

echo "🎉 启动测试容器..."
docker-compose -f docker-compose.test.yml up -d

# 检查容器状态
echo "⏳ 检查测试容器状态..."
sleep 5

if docker ps | grep -q "bahasa-beraja-test"; then
    echo "✅ 测试环境启动成功!"
    echo "🌐 访问地址: http://localhost:2999"
    echo "🌐 服务器地址: http://31.97.66.59:2999"
    echo ""
    echo "📋 容器信息:"
    docker ps | grep bahasa-beraja-test
    echo ""
    echo "📝 查看日志: docker logs bahasa-beraja-test"
    echo "🛑 停止服务: docker-compose -f docker-compose.test.yml down"
else
    echo "❌ 测试环境启动失败!"
    echo "📋 查看错误日志:"
    docker-compose -f docker-compose.test.yml logs
fi 