const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 所有管理员路由都需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);

// 获取系统概览统计
router.get('/stats', async (req, res) => {
  try {
    // 获取各种统计数据
    const [userStats, quizStats, sessionStats, recentActivity] = await Promise.all([
      // 用户统计
      query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
          COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_users,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_7d,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
        FROM users
      `),
      
      // 测验统计
      query(`
        SELECT 
          COUNT(*) as total_quizzes,
          AVG(score) as average_score,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as quizzes_7d,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as quizzes_30d
        FROM quiz_history
      `),
      
      // 会话统计
      query(`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_sessions,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as sessions_24h
        FROM user_sessions
      `),
      
      // 最近活动
      query(`
        SELECT 
          COUNT(CASE WHEN success = true THEN 1 END) as successful_logins,
          COUNT(CASE WHEN success = false THEN 1 END) as failed_logins
        FROM login_logs 
        WHERE created_at > NOW() - INTERVAL '24 hours'
      `)
    ]);

    res.json({
      stats: {
        users: userStats.rows[0],
        quizzes: quizStats.rows[0],
        sessions: sessionStats.rows[0],
        recentActivity: recentActivity.rows[0]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch admin statistics',
      code: 'ADMIN_STATS_ERROR'
    });
  }
});

// 获取用户列表
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status; // 'active', 'inactive', 'all'

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // 搜索条件
    if (search) {
      whereClause += ` AND (u.user_id ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.display_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 状态过滤
    if (status === 'active') {
      whereClause += ` AND u.is_active = true`;
    } else if (status === 'inactive') {
      whereClause += ` AND u.is_active = false`;
    }

    // 获取用户列表
    const usersResult = await query(`
      SELECT 
        u.user_id, u.email, u.display_name, u.is_active, u.is_admin,
        u.email_verified, u.last_login_at, u.login_count, u.created_at,
        STRING_AGG(ur.role_name, ', ') as roles,
        up.words_learned, up.streak,
        ls.quizzes_taken, ls.average_score
      FROM users u
      LEFT JOIN user_roles ur ON u.user_id = ur.user_id
      LEFT JOIN user_progress up ON u.user_id = up.user_id
      LEFT JOIN learning_stats ls ON u.user_id = ls.user_id
      ${whereClause}
      GROUP BY u.user_id, u.email, u.display_name, u.is_active, u.is_admin,
               u.email_verified, u.last_login_at, u.login_count, u.created_at,
               up.words_learned, up.streak, ls.quizzes_taken, ls.average_score
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    // 获取总数
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `, params);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users: usersResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({
      error: 'Failed to fetch users list',
      code: 'USERS_LIST_ERROR'
    });
  }
});

// 获取用户详细信息
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await query(`
      SELECT * FROM user_profile_view WHERE user_id = $1
    `, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 获取用户的登录历史
    const loginHistoryResult = await query(`
      SELECT created_at, ip_address, user_agent, success, failure_reason
      FROM login_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    // 获取用户的活跃会话
    const sessionsResult = await query(`
      SELECT session_token, created_at, expires_at, user_agent, ip_address, is_active
      FROM user_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      user: userResult.rows[0],
      loginHistory: loginHistoryResult.rows,
      activeSessions: sessionsResult.rows
    });

  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({
      error: 'Failed to fetch user details',
      code: 'USER_DETAIL_ERROR'
    });
  }
});

// 更新用户状态
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, isAdmin } = req.body;
    const adminUserId = req.user.userId;

    // 防止管理员禁用自己
    if (userId === adminUserId && isActive === false) {
      return res.status(400).json({
        error: 'Cannot deactivate your own account',
        code: 'SELF_DEACTIVATION_DENIED'
      });
    }

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    if (typeof isActive === 'boolean') {
      updateFields.push(`is_active = $${paramIndex}`);
      values.push(isActive);
      paramIndex++;
    }

    if (typeof isAdmin === 'boolean') {
      updateFields.push(`is_admin = $${paramIndex}`);
      values.push(isAdmin);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update',
        code: 'NO_UPDATE_FIELDS'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING user_id, is_active, is_admin, updated_at
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      message: 'User status updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Admin user status update error:', error);
    res.status(500).json({
      error: 'Failed to update user status',
      code: 'USER_STATUS_UPDATE_ERROR'
    });
  }
});

// 获取系统日志
router.get('/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const type = req.query.type; // 'success', 'failure', 'all'

    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (type === 'success') {
      whereClause += ' AND success = true';
    } else if (type === 'failure') {
      whereClause += ' AND success = false';
    }

    const logsResult = await query(`
      SELECT 
        ll.created_at, ll.user_id, ll.email, ll.ip_address, 
        ll.success, ll.failure_reason, ll.user_agent,
        u.display_name
      FROM login_logs ll
      LEFT JOIN users u ON ll.user_id = u.user_id
      ${whereClause}
      ORDER BY ll.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM login_logs ll ${whereClause}
    `);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      logs: logsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Admin logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch system logs',
      code: 'LOGS_ERROR'
    });
  }
});

// 清理过期会话
router.post('/cleanup/sessions', async (req, res) => {
  try {
    const result = await query(`
      SELECT cleanup_expired_sessions() as deleted_count
    `);

    const deletedCount = result.rows[0].deleted_count;

    res.json({
      message: 'Session cleanup completed',
      deletedSessions: deletedCount
    });

  } catch (error) {
    console.error('Session cleanup error:', error);
    res.status(500).json({
      error: 'Failed to cleanup sessions',
      code: 'CLEANUP_ERROR'
    });
  }
});

// 系统健康检查
router.get('/health', async (req, res) => {
  try {
    const [dbCheck, tableStats] = await Promise.all([
      query('SELECT NOW() as timestamp, version() as version'),
      query(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
      `)
    ]);

    res.json({
      status: 'healthy',
      database: {
        connected: true,
        timestamp: dbCheck.rows[0].timestamp,
        version: dbCheck.rows[0].version.split(' ')[0]
      },
      tables: tableStats.rows,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      code: 'HEALTH_CHECK_ERROR'
    });
  }
});

module.exports = router; 