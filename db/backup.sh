#!/bin/bash

# PiMiBahasa 数据库备份脚本

BACKUP_DIR="./backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="pimi_bahasa_backup_${DATE}.sql"

echo "💾 开始备份 PiMiBahasa 数据库..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
docker exec pimi_bahasa_mysql mysqldump -u pimi_user -ppimi_pass_2024 pimi_bahasa > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ 数据库备份成功！"
    echo "📁 备份文件: $BACKUP_DIR/$BACKUP_FILE"
    
    # 压缩备份文件
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "📦 备份文件已压缩: $BACKUP_DIR/$BACKUP_FILE.gz"
else
    echo "❌ 数据库备份失败！"
    exit 1
fi 