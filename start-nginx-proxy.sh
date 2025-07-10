#!/bin/bash

set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$SCRIPT_DIR"

echo "🚀 启动 Bahasa Beraja Nginx 代理服务..."

docker-compose -f nginx-docker-compose.yml up -d

sleep 2
echo "✅ Nginx 代理已启动，监听 80 端口。"
echo "🌐 访问: http://www.pimibahasa.com 或 http://<你的服务器IP>" 