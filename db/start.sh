#!/bin/bash

# PiMiBahasa 数据库启动脚本

echo "🚀 启动 PiMiBahasa MySQL 数据库..."

# 创建数据目录
sudo mkdir -p /home/data/pimi_bahasa_mysql
sudo chown -R 999:999 /home/data/pimi_bahasa_mysql

# 启动数据库服务
docker-compose up -d

echo "✅ 数据库启动完成！"
echo ""
echo "📊 数据库信息："
echo "   - 主机: localhost"
echo "   - 端口: 3306"
echo "   - 数据库: pimi_bahasa"
echo "   - 用户名: pimi_user"
echo "   - 密码: pimi_pass_2024"
echo ""
echo "🌐 管理界面："
echo "   - phpMyAdmin: http://localhost:8081"
echo "   - 用户名: pimi_user"
echo "   - 密码: pimi_pass_2024"
echo ""
echo "📁 数据存储位置: /home/data/pimi_bahasa_mysql" 