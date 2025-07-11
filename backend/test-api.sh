#!/bin/bash

echo "🧪 测试 PiMiBahasa API 接口..."

BASE_URL="http://localhost:3001"

# 测试健康检查
echo "1. 测试健康检查..."
curl -s "${BASE_URL}/health" | jq '.' || echo "❌ 健康检查失败"

echo ""
echo "2. 测试用户注册..."
curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@pimibahasa.com",
    "password": "123456",
    "display_name": "新用户"
  }' | jq '.' || echo "❌ 注册失败"

echo ""
echo "3. 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }')

echo "$LOGIN_RESPONSE" | jq '.' || echo "❌ 登录失败"

# 提取token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo ""
    echo "4. 测试获取用户信息..."
    curl -s -X GET "${BASE_URL}/api/user/profile" \
      -H "Authorization: Bearer $TOKEN" | jq '.' || echo "❌ 获取用户信息失败"
else
    echo "❌ 无法获取访问令牌"
fi

echo ""
echo "✅ API 测试完成！" 