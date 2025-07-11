# PiMiBahasa API 接口文档

## 概述

PiMiBahasa API 是印尼语学习平台的后端服务，提供用户认证、用户管理等功能。

- **基础URL**: `http://localhost:3001`
- **API版本**: v1.0.0
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

## 认证

API使用JWT（JSON Web Token）进行认证。需要在请求头中包含Bearer Token：

```
Authorization: Bearer <your-jwt-token>
```

## 通用响应格式

所有API响应都遵循以下格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

错误响应：

```json
{
  "success": false,
  "message": "错误信息",
  "errors": ["详细错误列表"] // 可选
}
```

## 状态码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 权限不足
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器内部错误

---

## 认证相关接口

### 1. 用户注册

**接口地址**: `POST /api/auth/register`

**请求参数**:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "display_name": "测试用户",
  "phone": "+86 13800138000",
  "country": "CN",
  "language": "zh-CN",
  "timezone": "Asia/Shanghai"
}
```

**参数说明**:
- `username` (必填): 用户名，3-20个字符，只能包含字母和数字
- `email` (可选): 邮箱地址
- `password` (可选): 密码，6-50个字符，不提供则为第三方登录用户
- `display_name` (必填): 显示昵称，2-50个字符
- `phone` (可选): 手机号
- `country` (可选): 国家代码，默认CN
- `language` (可选): 语言代码，默认zh-CN
- `timezone` (可选): 时区，默认Asia/Shanghai

**响应示例**:

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "display_name": "测试用户",
      "email": "test@example.com",
      "role": "user",
      "status": "active",
      "balance": 0,
      "vip_level": 0,
      "login_count": 1,
      "last_login_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:

```json
{
  "username": "testuser",
  "password": "123456"
}
```

**参数说明**:
- `username` (必填): 用户名
- `password` (必填): 密码

**响应示例**:

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "display_name": "测试用户",
      "email": "test@example.com",
      "role": "user",
      "status": "active",
      "balance": 100.50,
      "vip_level": 1,
      "login_count": 5,
      "last_login_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. 刷新访问令牌

**接口地址**: `POST /api/auth/refresh`

**请求参数**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**参数说明**:
- `refresh_token` (必填): 刷新令牌

**响应示例**:

```json
{
  "success": true,
  "message": "令牌刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 用户相关接口

### 1. 获取用户信息

**接口地址**: `GET /api/user/profile`

**请求头**:
```
Authorization: Bearer <your-jwt-token>
```

**响应示例**:

```json
{
  "success": true,
  "message": "获取用户信息成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "display_name": "测试用户",
    "avatar_url": "https://example.com/avatar.jpg",
    "phone": "+86 13800138000",
    "country": "CN",
    "language": "zh-CN",
    "timezone": "Asia/Shanghai",
    "status": "active",
    "role": "user",
    "email_verified": false,
    "phone_verified": false,
    "balance": 100.50,
    "vip_level": 1,
    "vip_expire_at": "2024-12-31T23:59:59.000Z",
    "total_recharge": 500.00,
    "total_consumption": 399.50,
    "login_count": 25,
    "last_login_at": "2024-01-15T10:30:00.000Z",
    "total_study_time": 1200,
    "streak_days": 7,
    "longest_streak": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. 更新用户信息

**接口地址**: `PUT /api/user/profile`

**请求头**:
```
Authorization: Bearer <your-jwt-token>
```

**请求参数**:

```json
{
  "display_name": "新昵称",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "phone": "+86 13900139000",
  "country": "CN",
  "language": "zh-CN",
  "timezone": "Asia/Shanghai"
}
```

**参数说明**:
- `display_name` (可选): 显示昵称，2-50个字符
- `avatar_url` (可选): 头像URL
- `phone` (可选): 手机号
- `country` (可选): 国家代码
- `language` (可选): 语言代码
- `timezone` (可选): 时区

**响应示例**:

```json
{
  "success": true,
  "message": "用户信息更新成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "display_name": "新昵称",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "phone": "+86 13900139000",
    "country": "CN",
    "language": "zh-CN",
    "timezone": "Asia/Shanghai",
    "status": "active",
    "role": "user",
    "email_verified": false,
    "phone_verified": false,
    "balance": 100.50,
    "vip_level": 1,
    "vip_expire_at": "2024-12-31T23:59:59.000Z",
    "total_recharge": 500.00,
    "total_consumption": 399.50,
    "login_count": 25,
    "last_login_at": "2024-01-15T10:30:00.000Z",
    "total_study_time": 1200,
    "streak_days": 7,
    "longest_streak": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 系统接口

### 1. 健康检查

**接口地址**: `GET /health`

**响应示例**:

```json
{
  "success": true,
  "message": "PiMiBahasa API 服务运行正常",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. 根路径

**接口地址**: `GET /`

**响应示例**:

```json
{
  "success": true,
  "message": "欢迎使用 PiMiBahasa API",
  "version": "1.0.0",
  "documentation": "/api-docs"
}
```

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | 未授权访问 | 检查JWT令牌是否有效 |
| 403 | 权限不足 | 检查用户角色和权限 |
| 404 | 资源不存在 | 检查请求的资源是否存在 |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器内部错误 | 联系技术支持 |

### 错误响应示例

```json
{
  "success": false,
  "message": "用户名已存在",
  "errors": [
    "用户名只能包含字母和数字",
    "用户名至少3个字符"
  ]
}
```

---

## 使用示例

### JavaScript/Node.js

```javascript
// 用户注册
const registerUser = async () => {
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
      display_name: '测试用户'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// 用户登录
const loginUser = async () => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'testuser',
      password: '123456'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refresh_token', data.data.refresh_token);
  }
};

// 获取用户信息
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/user/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Python

```python
import requests
import json

# 用户注册
def register_user():
    url = 'http://localhost:3001/api/auth/register'
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': '123456',
        'display_name': '测试用户'
    }
    
    response = requests.post(url, json=data)
    return response.json()

# 用户登录
def login_user():
    url = 'http://localhost:3001/api/auth/login'
    data = {
        'username': 'testuser',
        'password': '123456'
    }
    
    response = requests.post(url, json=data)
    return response.json()

# 获取用户信息
def get_user_profile(token):
    url = 'http://localhost:3001/api/user/profile'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## 注意事项

1. **JWT令牌过期**: 访问令牌有效期为15分钟，刷新令牌有效期为7天
2. **请求频率限制**: 每个IP在15分钟内最多100个请求
3. **密码安全**: 密码至少6个字符，建议使用强密码
4. **数据验证**: 所有输入数据都会进行严格验证
5. **错误处理**: 建议实现完善的错误处理机制

---

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 实现用户注册和登录功能
- 实现JWT认证机制
- 实现用户信息管理
- 添加API文档和Swagger支持 