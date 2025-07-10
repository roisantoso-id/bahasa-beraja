#!/bin/bash

echo "🛑 停止Bahasa Beraja项目所有容器..."
echo "=================================="

# 停止所有相关容器
echo "停止容器..."

docker stop test-nginx 2>/dev/null && echo "✅ test-nginx 已停止" || echo "❌ test-nginx 停止失败"
docker stop bahasa-beraja-nginx-proxy 2>/dev/null && echo "✅ bahasa-beraja-nginx-proxy 已停止" || echo "❌ bahasa-beraja-nginx-proxy 停止失败"
docker stop bahasa-beraja-app-dev 2>/dev/null && echo "✅ bahasa-beraja-app-dev 已停止" || echo "❌ bahasa-beraja-app-dev 停止失败"
docker stop bahasa-beraja-api-dev 2>/dev/null && echo "✅ bahasa-beraja-api-dev 已停止" || echo "❌ bahasa-beraja-api-dev 停止失败"
docker stop bahasa-beraja-admin 2>/dev/null && echo "✅ bahasa-beraja-admin 已停止" || echo "❌ bahasa-beraja-admin 停止失败"
docker stop bahasa-beraja-db 2>/dev/null && echo "✅ bahasa-beraja-db 已停止" || echo "❌ bahasa-beraja-db 停止失败"
docker stop buildx_buildkit_default 2>/dev/null && echo "✅ buildx_buildkit_default 已停止" || echo "❌ buildx_buildkit_default 停止失败"

echo ""
echo "当前容器状态："
docker ps -a

echo ""
echo "=================================="
echo "✅ 操作完成" 