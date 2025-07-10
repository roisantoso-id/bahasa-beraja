#!/bin/bash

echo "🚀 启动 Bahasa Beraja 数据库服务..."

# 检查 database 目录是否存在
if [ ! -d "database" ]; then
    echo "❌ database 目录不存在！请确保在项目根目录运行此脚本。"
    exit 1
fi

# 进入 database 目录
cd database

# 创建网络（如果不存在）
echo "📡 创建数据库网络..."
docker network create bahasa_db_network 2>/dev/null || echo "⚠️  网络已存在，跳过创建"

# 启动数据库服务
echo "📦 启动数据库容器..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待数据库启动..."
sleep 5

# 检查服务状态
echo "✅ 检查服务状态..."
docker-compose ps

echo ""
echo "🎉 数据库服务启动完成！"
echo ""
echo "📊 访问信息："
echo "   PostgreSQL: localhost:5432"
echo "   pgAdmin:    http://localhost:5050"
echo ""
echo "🔐 登录信息："
echo "   数据库用户: bahasa_user"
echo "   数据库密码: bahasa_pass_2024"
echo "   pgAdmin邮箱: admin@bahasa.local"
echo "   pgAdmin密码: admin123456"
echo ""
echo "📚 详细配置请查看: database/README.md" 