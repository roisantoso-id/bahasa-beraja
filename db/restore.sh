#!/bin/bash

# PiMiBahasa 数据库恢复脚本

BACKUP_DIR="./backup"

if [ $# -eq 0 ]; then
    echo "❌ 请指定要恢复的备份文件！"
    echo "用法: ./restore.sh <备份文件名>"
    echo "示例: ./restore.sh pimi_bahasa_backup_20240711_143000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "❌ 备份文件不存在: $BACKUP_DIR/$BACKUP_FILE"
    exit 1
fi

echo "🔄 开始恢复 PiMiBahasa 数据库..."
echo "📁 备份文件: $BACKUP_FILE"

# 确认操作
read -p "⚠️  此操作将覆盖现有数据，确定继续吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

# 解压备份文件（如果是压缩文件）
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c "$BACKUP_DIR/$BACKUP_FILE" | docker exec -i pimi_bahasa_mysql mysql -u pimi_user -ppimi_pass_2024 pimi_bahasa
else
    docker exec -i pimi_bahasa_mysql mysql -u pimi_user -ppimi_pass_2024 pimi_bahasa < "$BACKUP_DIR/$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ 数据库恢复成功！"
else
    echo "❌ 数据库恢复失败！"
    exit 1
fi 