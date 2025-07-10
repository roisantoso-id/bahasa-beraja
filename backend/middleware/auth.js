const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid access token',
        code: 'NO_TOKEN'
      });
    }

    // 验证JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // 检查token类型
    if (decoded.type !== 'access') {
      return res.status(401).json({
        error: 'Invalid token type',
        message: 'Please provide a valid access token',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // 检查用户是否仍然存在且活跃
    const userResult = await query(`
      SELECT user_id, email, is_active, is_admin
      FROM users 
      WHERE user_id = $1 AND is_active = true
    `, [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'User not found or inactive',
        message: 'The user associated with this token is no longer active',
        code: 'USER_INACTIVE'
      });
    }

    // 将用户信息附加到请求对象
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false,
      roles: decoded.roles || ['user']
    };

    next();

  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid',
        code: 'INVALID_TOKEN'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'The provided token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(500).json({
      error: 'Authentication error',
      message: 'Unable to verify token',
      code: 'AUTH_ERROR'
    });
  }
};

// 管理员权限中间件
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please authenticate first',
      code: 'NO_AUTH'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Admin access required',
      message: 'You do not have administrator privileges',
      code: 'INSUFFICIENT_PRIVILEGES'
    });
  }

  next();
};

// 特定角色权限中间件
const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Please authenticate first',
          code: 'NO_AUTH'
        });
      }

      // 管理员拥有所有权限
      if (req.user.isAdmin) {
        return next();
      }

      // 检查用户是否有特定角色
      const roleResult = await query(`
        SELECT 1 FROM user_roles 
        WHERE user_id = $1 AND role_name = $2
      `, [req.user.userId, requiredRole]);

      if (roleResult.rows.length === 0) {
        return res.status(403).json({
          error: 'Insufficient privileges',
          message: `This action requires '${requiredRole}' role`,
          code: 'ROLE_REQUIRED'
        });
      }

      next();

    } catch (error) {
      console.error('Role verification error:', error);
      res.status(500).json({
        error: 'Permission check error',
        message: 'Unable to verify user permissions',
        code: 'PERMISSION_ERROR'
      });
    }
  };
};

// 可选认证中间件（不会因为缺少token而失败）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    if (decoded.type === 'access') {
      // 检查用户是否存在
      const userResult = await query(`
        SELECT user_id, email, is_active, is_admin
        FROM users 
        WHERE user_id = $1 AND is_active = true
      `, [decoded.userId]);

      if (userResult.rows.length > 0) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          isAdmin: decoded.isAdmin || false,
          roles: decoded.roles || ['user']
        };
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }

  } catch (error) {
    // 对于可选认证，静默忽略错误
    req.user = null;
  }

  next();
};

// 会话验证中间件
const validateSession = async (req, res, next) => {
  try {
    const { sessionToken } = req.body;
    
    if (!sessionToken) {
      return res.status(400).json({
        error: 'Session token required',
        code: 'NO_SESSION_TOKEN'
      });
    }

    // 检查会话是否有效
    const sessionResult = await query(`
      SELECT user_id, expires_at, is_active
      FROM user_sessions 
      WHERE session_token = $1
    `, [sessionToken]);

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid session',
        message: 'Session token not found',
        code: 'INVALID_SESSION'
      });
    }

    const session = sessionResult.rows[0];

    if (!session.is_active) {
      return res.status(401).json({
        error: 'Session inactive',
        message: 'This session has been deactivated',
        code: 'SESSION_INACTIVE'
      });
    }

    if (new Date() > new Date(session.expires_at)) {
      return res.status(401).json({
        error: 'Session expired',
        message: 'This session has expired',
        code: 'SESSION_EXPIRED'
      });
    }

    req.sessionUserId = session.user_id;
    next();

  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      error: 'Session validation error',
      code: 'SESSION_ERROR'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  optionalAuth,
  validateSession
}; 