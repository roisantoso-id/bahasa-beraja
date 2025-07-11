import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - display_name
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9]+$'
 *                 description: 用户名（只能包含字母和数字）
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱地址（可选）
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 50
 *                 description: 密码（可选，如果不提供则为第三方登录用户）
 *               display_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: 显示昵称
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9+\\-\\s()]+$'
 *                 description: 手机号（可选）
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: 国家代码（可选，默认CN）
 *               language:
 *                 type: string
 *                 pattern: '^[a-z]{2}-[A-Z]{2}$'
 *                 description: 语言代码（可选，默认zh-CN）
 *               timezone:
 *                 type: string
 *                 description: 时区（可选，默认Asia/Shanghai）
 *     responses:
 *       201:
 *         description: 注册成功
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
 *                   example: 注册成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: testuser
 *                         display_name:
 *                           type: string
 *                           example: 测试用户
 *                         email:
 *                           type: string
 *                           example: test@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         status:
 *                           type: string
 *                           example: active
 *                         balance:
 *                           type: number
 *                           example: 0
 *                         vip_level:
 *                           type: integer
 *                           example: 0
 *                         login_count:
 *                           type: integer
 *                           example: 1
 *                         last_login_at:
 *                           type: string
 *                           format: date-time
 *                     token:
 *                       type: string
 *                       description: JWT访问令牌
 *                     refresh_token:
 *                       type: string
 *                       description: JWT刷新令牌
 *       400:
 *         description: 请求数据验证失败或用户已存在
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
 *                   example: 用户名已存在
 *       500:
 *         description: 服务器内部错误
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
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
 *                   example: 登录成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: testuser
 *                         display_name:
 *                           type: string
 *                           example: 测试用户
 *                         email:
 *                           type: string
 *                           example: test@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         status:
 *                           type: string
 *                           example: active
 *                         balance:
 *                           type: number
 *                           example: 0
 *                         vip_level:
 *                           type: integer
 *                           example: 0
 *                         login_count:
 *                           type: integer
 *                           example: 5
 *                         last_login_at:
 *                           type: string
 *                           format: date-time
 *                     token:
 *                       type: string
 *                       description: JWT访问令牌
 *                     refresh_token:
 *                       type: string
 *                       description: JWT刷新令牌
 *       401:
 *         description: 用户名或密码错误
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
 *                   example: 用户名或密码错误
 *       500:
 *         description: 服务器内部错误
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 刷新访问令牌
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: 刷新令牌
 *     responses:
 *       200:
 *         description: 令牌刷新成功
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
 *                   example: 令牌刷新成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: 新的JWT访问令牌
 *                     refresh_token:
 *                       type: string
 *                       description: 新的JWT刷新令牌
 *       401:
 *         description: 刷新令牌无效
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
 *                   example: 无效的刷新令牌
 *       500:
 *         description: 服务器内部错误
 */
router.post('/refresh', UserController.refreshToken);

export default router; 