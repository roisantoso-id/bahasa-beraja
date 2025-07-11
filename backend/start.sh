#!/bin/bash

echo "🚀 启动 PiMiBahasa 后端服务..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查Docker Compose是否可用
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ Docker Compose 不可用，请安装 Docker Compose"
    exit 1
fi

# 停止并删除现有容器
echo "🔄 清理现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up --build -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 测试健康检查
echo "🏥 测试健康检查..."
curl -f http://localhost:3001/health || echo "❌ 健康检查失败"

echo ""
echo "✅ PiMiBahasa 后端服务启动完成！"
echo ""
echo "📋 服务信息："
echo "   🌐 API服务: http://localhost:3001"
echo "   🏥 健康检查: http://localhost:3001/health"
echo "   🗄️  数据库: localhost:3306"
echo "   📊 phpMyAdmin: http://localhost:8080"
echo ""
echo "📝 测试账号："
echo "   用户名: testuser"
echo "   密码: 123456"
echo ""
echo "🔧 管理命令："
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart" 