#!/bin/bash

echo "🧹 清理测试容器..."
docker stop test-nginx 2>/dev/null || true
docker rm test-nginx 2>/dev/null || true
echo "✅ 测试容器已清理" 