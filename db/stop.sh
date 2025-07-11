#!/bin/bash

# PiMiBahasa 数据库停止脚本

echo "🛑 停止 PiMiBahasa MySQL 数据库..."

# 停止数据库服务
docker-compose down

echo "✅ 数据库已停止！"
echo ""
echo "💾 数据已保存到: /home/data/pimi_bahasa_mysql" 