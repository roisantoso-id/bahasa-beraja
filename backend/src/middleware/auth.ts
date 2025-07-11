import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        type: string;
      };
    }
  }
}

/**
 * JWT认证中间件
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
      return;
    }

    // 验证令牌
    const decoded = UserService.verifyToken(token);
    
    if (decoded.type !== 'access') {
      res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
      return;
    }

    // 将用户信息添加到请求对象
    req.user = {
      userId: decoded.userId,
      type: decoded.type
    };

    next();
  } catch (error) {
    console.error('令牌验证失败:', error);
    res.status(401).json({
      success: false,
      message: '无效的访问令牌'
    });
  }
};

/**
 * 角色验证中间件
 */
export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '未授权访问'
        });
        return;
      }

      // 获取用户信息以检查角色
      const user = await UserService.getUserById(req.user.userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: '用户不存在'
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: '权限不足'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('角色验证失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  };
};

/**
 * VIP用户验证中间件
 */
export const requireVIP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    // 获取用户信息以检查VIP状态
    const user = await UserService.getUserById(req.user.userId);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 检查VIP等级和到期时间
    if (user.vip_level === 0 || (user.vip_expire_at && new Date() > user.vip_expire_at)) {
      res.status(403).json({
        success: false,
        message: '需要VIP会员才能访问此功能'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('VIP验证失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * 可选认证中间件（不强制要求认证）
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = UserService.verifyToken(token);
        
        if (decoded.type === 'access') {
          req.user = {
            userId: decoded.userId,
            type: decoded.type
          };
        }
      } catch (error) {
        // 令牌无效，但不阻止请求继续
        console.warn('可选认证令牌无效:', error);
      }
    }

    next();
  } catch (error) {
    console.error('可选认证失败:', error);
    next(); // 继续处理请求
  }
}; 