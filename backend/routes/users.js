const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 所有用户路由都需要认证
router.use(authenticateToken);

// 更新用户资料
router.put('/profile', [
  body('displayName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const userId = req.user.userId;
    const { displayName, avatarUrl } = req.body;

    // 构建更新字段
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (displayName !== undefined) {
      updateFields.push(`display_name = $${paramIndex}`);
      values.push(displayName);
      paramIndex++;
    }

    if (avatarUrl !== undefined) {
      updateFields.push(`avatar_url = $${paramIndex}`);
      values.push(avatarUrl);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update',
        code: 'NO_UPDATE_FIELDS'
      });
    }

    // 添加更新时间戳和用户ID
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex} AND is_active = true
      RETURNING user_id, email, display_name, avatar_url, updated_at
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      code: 'UPDATE_ERROR'
    });
  }
});

// 修改密码
router.put('/password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // 获取当前密码hash
    const userResult = await query(`
      SELECT password_hash FROM users 
      WHERE user_id = $1 AND is_active = true
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword, 
      userResult.rows[0].password_hash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid current password',
        message: 'The current password you entered is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // 生成新密码hash
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 更新密码
    await query(`
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `, [newPasswordHash, userId]);

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      error: 'Failed to update password',
      code: 'PASSWORD_UPDATE_ERROR'
    });
  }
});

// 获取用户学习统计
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT * FROM user_profile_view WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User statistics not found',
        code: 'STATS_NOT_FOUND'
      });
    }

    const stats = result.rows[0];

    res.json({
      stats: {
        userId: stats.user_id,
        currentCategory: stats.current_category,
        currentWord: stats.current_word,
        totalStudyTime: stats.total_study_time,
        wordsLearned: stats.words_learned,
        streak: stats.streak,
        quizzesTaken: stats.quizzes_taken,
        averageScore: parseFloat(stats.average_score) || 0,
        roles: stats.roles
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics',
      code: 'STATS_ERROR'
    });
  }
});

// 获取用户活跃会话
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(`
      SELECT session_token, created_at, updated_at, expires_at, 
             user_agent, ip_address, is_active
      FROM user_sessions 
      WHERE user_id = $1 
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      sessions: result.rows.map(session => ({
        sessionToken: session.session_token,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        expiresAt: session.expires_at,
        userAgent: session.user_agent,
        ipAddress: session.ip_address,
        isActive: session.is_active
      }))
    });

  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch user sessions',
      code: 'SESSIONS_ERROR'
    });
  }
});

// 终止特定会话
router.delete('/sessions/:sessionToken', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionToken } = req.params;

    const result = await query(`
      UPDATE user_sessions 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND session_token = $2
      RETURNING session_token
    `, [userId, sessionToken]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND'
      });
    }

    res.json({
      message: 'Session terminated successfully',
      sessionToken: result.rows[0].session_token
    });

  } catch (error) {
    console.error('Session termination error:', error);
    res.status(500).json({
      error: 'Failed to terminate session',
      code: 'SESSION_TERMINATION_ERROR'
    });
  }
});

// 删除用户账户
router.delete('/account', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
  body('confirmDelete')
    .equals('DELETE')
    .withMessage('Please type DELETE to confirm account deletion')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const userId = req.user.userId;
    const { password } = req.body;

    // 验证密码
    const userResult = await query(`
      SELECT password_hash FROM users 
      WHERE user_id = $1 AND is_active = true
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password, 
      userResult.rows[0].password_hash
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password verification failed',
        code: 'INVALID_PASSWORD'
      });
    }

    // 软删除用户账户（设置为不活跃）
    await query(`
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);

    // 使所有会话失效
    await query(`
      UPDATE user_sessions 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      code: 'ACCOUNT_DELETION_ERROR'
    });
  }
});

module.exports = router; 