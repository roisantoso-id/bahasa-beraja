#!/bin/bash

echo "💀 强制停止Bahasa Beraja项目所有容器..."
echo "====================================="

# 强制停止所有相关容器
echo "强制停止容器..."

docker kill test-nginx 2>/dev/null && echo "✅ test-nginx 已强制停止" || echo "❌ test-nginx 强制停止失败"
docker kill bahasa-beraja-nginx-proxy 2>/dev/null && echo "✅ bahasa-beraja-nginx-proxy 已强制停止" || echo "❌ bahasa-beraja-nginx-proxy 强制停止失败"
docker kill bahasa-beraja-app-dev 2>/dev/null && echo "✅ bahasa-beraja-app-dev 已强制停止" || echo "❌ bahasa-beraja-app-dev 强制停止失败"
docker kill bahasa-beraja-api-dev 2>/dev/null && echo "✅ bahasa-beraja-api-dev 已强制停止" || echo "❌ bahasa-beraja-api-dev 强制停止失败"
docker kill bahasa-beraja-admin 2>/dev/null && echo "✅ bahasa-beraja-admin 已强制停止" || echo "❌ bahasa-beraja-admin 强制停止失败"
docker kill bahasa-beraja-db 2>/dev/null && echo "✅ bahasa-beraja-db 已强制停止" || echo "❌ bahasa-beraja-db 强制停止失败"
docker kill buildx_buildkit_default 2>/dev/null && echo "✅ buildx_buildkit_default 已强制停止" || echo "❌ buildx_buildkit_default 强制停止失败"

echo ""
echo "当前容器状态："
docker ps -a

echo ""
echo "====================================="
echo "✅ 操作完成" 