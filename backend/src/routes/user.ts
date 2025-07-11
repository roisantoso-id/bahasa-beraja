import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取用户信息成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 获取用户信息成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     display_name:
 *                       type: string
 *                       example: 测试用户
 *                     avatar_url:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     phone:
 *                       type: string
 *                       example: +86 13800138000
 *                     country:
 *                       type: string
 *                       example: CN
 *                     language:
 *                       type: string
 *                       example: zh-CN
 *                     timezone:
 *                       type: string
 *                       example: Asia/Shanghai
 *                     status:
 *                       type: string
 *                       example: active
 *                     role:
 *                       type: string
 *                       example: user
 *                     email_verified:
 *                       type: boolean
 *                       example: false
 *                     phone_verified:
 *                       type: boolean
 *                       example: false
 *                     balance:
 *                       type: number
 *                       example: 100.50
 *                     vip_level:
 *                       type: integer
 *                       example: 1
 *                     vip_expire_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-12-31T23:59:59Z
 *                     total_recharge:
 *                       type: number
 *                       example: 500.00
 *                     total_consumption:
 *                       type: number
 *                       example: 399.50
 *                     login_count:
 *                       type: integer
 *                       example: 25
 *                     last_login_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *                     total_study_time:
 *                       type: integer
 *                       example: 1200
 *                     streak_days:
 *                       type: integer
 *                       example: 7
 *                     longest_streak:
 *                       type: integer
 *                       example: 15
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
router.get('/profile', authenticateToken, UserController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: 更新用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 显示昵称
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 description: 头像URL
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9+\\-\\s()]+$'
 *                 description: 手机号
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: 国家代码
 *               language:
 *                 type: string
 *                 pattern: '^[a-z]{2}-[A-Z]{2}$'
 *                 description: 语言代码
 *               timezone:
 *                 type: string
 *                 description: 时区
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 用户信息更新成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: testuser
 *                     display_name:
 *                       type: string
 *                       example: 新昵称
 *                     avatar_url:
 *                       type: string
 *                       example: https://example.com/new-avatar.jpg
 *                     phone:
 *                       type: string
 *                       example: +86 13900139000
 *                     country:
 *                       type: string
 *                       example: CN
 *                     language:
 *                       type: string
 *                       example: zh-CN
 *                     timezone:
 *                       type: string
 *                       example: Asia/Shanghai
 *                     status:
 *                       type: string
 *                       example: active
 *                     role:
 *                       type: string
 *                       example: user
 *                     email_verified:
 *                       type: boolean
 *                       example: false
 *                     phone_verified:
 *                       type: boolean
 *                       example: false
 *                     balance:
 *                       type: number
 *                       example: 100.50
 *                     vip_level:
 *                       type: integer
 *                       example: 1
 *                     vip_expire_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-12-31T23:59:59Z
 *                     total_recharge:
 *                       type: number
 *                       example: 500.00
 *                     total_consumption:
 *                       type: number
 *                       example: 399.50
 *                     login_count:
 *                       type: integer
 *                       example: 25
 *                     last_login_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *                     total_study_time:
 *                       type: integer
 *                       example: 1200
 *                     streak_days:
 *                       type: integer
 *                       example: 7
 *                     longest_streak:
 *                       type: integer
 *                       example: 15
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *       400:
 *         description: 请求数据验证失败或没有可更新的字段
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 没有可更新的字段
 *       401:
 *         description: 未授权访问
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 未授权访问
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 用户不存在
 *       500:
 *         description: 服务器内部错误
 */
router.put('/profile', authenticateToken, UserController.updateProfile);

export default router; 