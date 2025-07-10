#!/bin/bash

echo "🎨 启动 Bahasa Beraja 前端服务..."

# 检查数据库网络是否存在
if ! docker network ls | grep -q "bahasa_db_network"; then
    echo "❌ 数据库网络不存在！请先启动数据库服务："
    echo "   ./start-database.sh"
    exit 1
fi

# 检查数据库是否运行
if ! docker ps | grep -q "bahasa-beraja-db"; then
    echo "⚠️  数据库服务未运行，正在启动..."
    ./start-database.sh
    echo "⏳ 等待数据库就绪..."
    sleep 10
fi

echo "📦 启动前端容器..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待前端启动..."
sleep 5

# 检查服务状态
echo "✅ 检查服务状态..."
docker-compose ps

echo ""
echo "🎉 前端服务启动完成！"
echo ""
echo "🌐 访问地址："
echo "   前端应用: http://localhost:2999"
echo "   API接口:  http://localhost:3001"
echo ""
echo "📊 数据库管理："
echo "   pgAdmin:  http://localhost:5050"
echo "" 