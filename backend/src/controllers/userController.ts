import { Request, Response } from 'express';
import Joi from 'joi';
import { UserService, RegisterData, LoginData } from '../services/userService';

// 验证模式
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.alphanum': '用户名只能包含字母和数字',
      'string.min': '用户名至少3个字符',
      'string.max': '用户名最多20个字符',
      'any.required': '用户名是必填项'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': '邮箱格式不正确'
    }),
  password: Joi.string()
    .min(6)
    .max(50)
    .optional()
    .messages({
      'string.min': '密码至少6个字符',
      'string.max': '密码最多50个字符'
    }),
  display_name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '昵称至少2个字符',
      'string.max': '昵称最多50个字符',
      'any.required': '昵称是必填项'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .messages({
      'string.pattern.base': '手机号格式不正确'
    }),
  country: Joi.string()
    .length(2)
    .optional()
    .messages({
      'string.length': '国家代码必须是2个字符'
    }),
  language: Joi.string()
    .pattern(/^[a-z]{2}-[A-Z]{2}$/)
    .optional()
    .messages({
      'string.pattern.base': '语言代码格式不正确，应为 xx-XX'
    }),
  timezone: Joi.string()
    .optional()
});

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': '用户名是必填项'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': '密码是必填项'
    })
});

export class UserController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // 验证请求数据
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: '请求数据验证失败',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const registerData: RegisterData = value;

      // 调用服务层注册用户
      const result = await UserService.register(registerData);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: result
      });
    } catch (error) {
      console.error('注册失败:', error);
      
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误'
        });
      }
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // 验证请求数据
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: '请求数据验证失败',
          errors: error.details.map(detail => detail.message)
        });
        return;
      }

      const loginData: LoginData = value;

      // 调用服务层登录用户
      const result = await UserService.login(loginData);

      res.status(200).json({
        success: true,
        message: '登录成功',
        data: result
      });
    } catch (error) {
      console.error('登录失败:', error);
      
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误'
        });
      }
    }
  }

  /**
   * 刷新访问令牌
   * POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        res.status(400).json({
          success: false,
          message: '刷新令牌是必填项'
        });
        return;
      }

      // 调用服务层刷新令牌
      const result = await UserService.refreshToken(refresh_token);

      res.status(200).json({
        success: true,
        message: '令牌刷新成功',
        data: result
      });
    } catch (error) {
      console.error('令牌刷新失败:', error);
      
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: '服务器内部错误'
        });
      }
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/user/profile
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // 从JWT中获取用户ID
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授权访问'
        });
        return;
      }

      // 获取用户信息
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      // 返回用户信息（排除敏感字段）
      const { password_hash, ...userInfo } = user;

      res.status(200).json({
        success: true,
        message: '获取用户信息成功',
        data: userInfo
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }

  /**
   * 更新用户信息
   * PUT /api/user/profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: '未授权访问'
        });
        return;
      }

      // 只允许更新特定字段
      const allowedFields = ['display_name', 'avatar_url', 'phone', 'country', 'language', 'timezone'];
      const updateData: any = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: '没有可更新的字段'
        });
        return;
      }

      // 更新用户信息
      const updatedUser = await UserService.updateUser(userId, updateData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      // 返回更新后的用户信息（排除敏感字段）
      const { password_hash, ...userInfo } = updatedUser;

      res.status(200).json({
        success: true,
        message: '用户信息更新成功',
        data: userInfo
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }
} 