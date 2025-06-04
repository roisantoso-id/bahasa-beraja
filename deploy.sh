#!/bin/bash

echo "🇮🇩 Bahasa Beraja - 印尼语学习应用部署脚本"
echo "============================================="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo "✅ Docker环境检查通过"

# 停止并删除相关容器
echo "🛑 停止并删除相关容器..."
docker-compose down
docker rm -f bahasa-app bahasa-nginx 2>/dev/null

# 重新构建镜像
echo "🔨 重新构建Docker镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 检查容器状态
echo "📊 检查容器状态..."
sleep 5

if docker-compose ps | grep -q "Up"; then
    echo "✅ 应用启动成功！"
    echo ""
    echo "🌐 访问地址: http://31.97.66.59:3000"
    echo "📱 移动端访问: http://31.97.66.59:3000"
    echo ""
    echo "🔧 管理命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  停止应用: docker-compose down"
    echo "  重启应用: docker-compose restart"
    echo ""
    echo "🎉 开始学习印尼语吧！Selamat belajar!"
else
    echo "❌ 应用启动失败，请检查日志:"
    docker-compose logs
    exit 1
fi 