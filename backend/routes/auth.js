const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 认证限流（更严格）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10, // 每15分钟最多10次认证尝试
  message: {
    error: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT'
  },
  skipSuccessfulRequests: true
});

// 验证规则
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// 注册路由
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { username, email, password, displayName } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // 使用事务确保数据一致性
    const result = await transaction(async (client) => {
      // 检查用户名是否已存在
      const existingUser = await client.query(
        'SELECT user_id FROM users WHERE user_id = $1 OR email = $2',
        [username.toLowerCase(), email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Username or email already exists');
      }

      // 加密密码
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 创建用户
      const userResult = await client.query(`
        INSERT INTO users (
          user_id, email, password_hash, display_name, 
          registration_ip, is_active, email_verified, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        RETURNING user_id, email, display_name, created_at
      `, [
        username.toLowerCase(),
        email,
        passwordHash,
        displayName || username,
        clientIP,
        true,
        false // 邮箱验证暂时设为false，将来可以添加邮箱验证
      ]);

      const newUser = userResult.rows[0];

      // 分配默认用户角色
      await client.query(`
        INSERT INTO user_roles (user_id, role_name, granted_by)
        VALUES ($1, 'user', 'system')
      `, [newUser.user_id]);

      // 创建初始学习进度
      await client.query(`
        INSERT INTO user_progress (user_id)
        VALUES ($1)
      `, [newUser.user_id]);

      // 创建初始学习统计
      await client.query(`
        INSERT INTO learning_stats (user_id)
        VALUES ($1)
      `, [newUser.user_id]);

      return newUser;
    });

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: result.user_id,
        email: result.email,
        type: 'access'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 记录登录日志
    await query(`
      INSERT INTO login_logs (user_id, email, ip_address, user_agent, success)
      VALUES ($1, $2, $3, $4, $5)
    `, [result.user_id, result.email, clientIP, req.get('User-Agent'), true]);

    // 返回成功响应（不包含密码）
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user_id,
        email: result.email,
        displayName: result.display_name,
        createdAt: result.created_at
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    console.error('Registration error:', error);

    // 记录失败的注册尝试
    if (req.body.email) {
      await query(`
        INSERT INTO login_logs (email, ip_address, user_agent, success, failure_reason)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        req.body.email,
        req.ip || req.connection.remoteAddress,
        req.get('User-Agent'),
        false,
        error.message
      ]).catch(console.error);
    }

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Username or email is already registered',
        code: 'USER_EXISTS'
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to create user account',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// 登录路由
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;

    // 查找用户
    const userResult = await query(`
      SELECT u.*, STRING_AGG(ur.role_name, ',') as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      WHERE u.email = $1 AND u.is_active = true
      GROUP BY u.id, u.user_id, u.email, u.password_hash, u.display_name, 
               u.avatar_url, u.is_active, u.is_admin, u.email_verified, 
               u.last_login_at, u.login_count, u.registration_ip, 
               u.last_login_ip, u.created_at, u.updated_at
    `, [email]);

    if (userResult.rows.length === 0) {
      // 记录失败尝试
      await query(`
        INSERT INTO login_logs (email, ip_address, user_agent, success, failure_reason)
        VALUES ($1, $2, $3, $4, $5)
      `, [email, clientIP, req.get('User-Agent'), false, 'User not found']);

      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = userResult.rows[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      // 记录失败尝试
      await query(`
        INSERT INTO login_logs (user_id, email, ip_address, user_agent, success, failure_reason)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [user.user_id, email, clientIP, req.get('User-Agent'), false, 'Invalid password']);

      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id,
        email: user.email,
        isAdmin: user.is_admin,
        roles: user.roles ? user.roles.split(',') : ['user'],
        type: 'access'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 更新用户登录信息
    await query(`
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, 
          last_login_ip = $1,
          login_count = login_count + 1
      WHERE user_id = $2
    `, [clientIP, user.user_id]);

    // 记录成功登录
    await query(`
      INSERT INTO login_logs (user_id, email, ip_address, user_agent, success)
      VALUES ($1, $2, $3, $4, $5)
    `, [user.user_id, email, clientIP, req.get('User-Agent'), true]);

    // 创建会话记录
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天后过期

    await query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `, [user.user_id, sessionToken, expiresAt, req.get('User-Agent'), clientIP]);

    // 返回成功响应
    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        displayName: user.display_name,
        isAdmin: user.is_admin,
        roles: user.roles ? user.roles.split(',') : ['user'],
        lastLoginAt: user.last_login_at,
        emailVerified: user.email_verified
      },
      token,
      sessionToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to process login request',
      code: 'LOGIN_ERROR'
    });
  }
});

// 登出路由
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { sessionToken } = req.body;
    const userId = req.user.userId;

    // 使会话失效
    if (sessionToken) {
      await query(`
        UPDATE user_sessions 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND session_token = $2
      `, [userId, sessionToken]);
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Unable to process logout request',
      code: 'LOGOUT_ERROR'
    });
  }
});

// 获取当前用户信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT user_id, email, display_name, avatar_url, is_admin, 
             email_verified, last_login_at, login_count, created_at
      FROM users 
      WHERE user_id = $1 AND is_active = true
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.user_id,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        isAdmin: user.is_admin,
        emailVerified: user.email_verified,
        lastLoginAt: user.last_login_at,
        loginCount: user.login_count,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// 验证token路由
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  });
});

module.exports = router; 