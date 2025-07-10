#!/bin/bash

echo "🛑 停止所有 Bahasa Beraja 服务..."

# 停止前端服务
echo "📱 停止前端服务..."
docker-compose down

# 停止数据库服务
echo "🗄️  停止数据库服务..."
cd database
docker-compose down
cd ..

echo ""
echo "✅ 所有服务已停止"
echo ""
echo "💡 提示："
echo "   - 数据已持久化保存在 /home/data/ 目录"
echo "   - 重启服务不会丢失数据"
echo "   - 使用 ./start-database.sh 和 ./start-frontend.sh 重新启动" 