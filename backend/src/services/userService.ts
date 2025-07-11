import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserAttributes, UserCreationAttributes } from '../models/User';

export interface RegisterData {
  username: string;
  email?: string;
  password?: string;
  display_name: string;
  phone?: string;
  country?: string;
  language?: string;
  timezone?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    display_name: string;
    email?: string | undefined;
    avatar_url?: string | undefined;
    role: string;
    status: string;
    balance: number;
    vip_level: number;
    login_count: number;
    last_login_at?: Date;
  };
  token: string;
  refresh_token: string;
}

export class UserService {
  /**
   * 用户注册
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({
      where: { username: data.username }
    });

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在（如果提供）
    if (data.email) {
      const existingEmail = await User.findOne({
        where: { email: data.email }
      });

      if (existingEmail) {
        throw new Error('邮箱已被注册');
      }
    }

    // 加密密码（如果提供）
    let passwordHash: string | undefined;
    if (data.password) {
      const saltRounds = 12;
      passwordHash = await bcrypt.hash(data.password, saltRounds);
    }

    // 创建用户
    const userData: UserCreationAttributes = {
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      display_name: data.display_name,
      phone: data.phone,
      country: data.country || 'CN',
      language: data.language || 'zh-CN',
      timezone: data.timezone || 'Asia/Shanghai',
      status: 'active',
      role: 'user',
      email_verified: false,
      phone_verified: false,
      balance: 0,
      vip_level: 0,
      total_recharge: 0,
      total_consumption: 0,
      login_count: 0,
      total_study_time: 0,
      streak_days: 0,
      longest_streak: 0
    };

    const user = await User.create(userData);

    // 生成JWT令牌
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // 更新登录信息
    await user.update({
      login_count: user.login_count + 1,
      last_login_at: new Date()
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status,
        balance: user.balance,
        vip_level: user.vip_level,
        login_count: user.login_count + 1,
        last_login_at: new Date()
      },
      token,
      refresh_token: refreshToken
    };
  }

  /**
   * 用户登录
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    // 查找用户
    const user = await User.findOne({
      where: { username: data.username }
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new Error('账户已被禁用或待激活');
    }

    // 验证密码
    if (user.password_hash) {
      const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('用户名或密码错误');
      }
    } else {
      // 如果没有密码哈希，说明是第三方登录用户
      throw new Error('该账户不支持密码登录，请使用其他方式登录');
    }

    // 生成JWT令牌
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // 更新登录信息
    await user.update({
      login_count: user.login_count + 1,
      last_login_at: new Date()
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status,
        balance: user.balance,
        vip_level: user.vip_level,
        login_count: user.login_count + 1,
        last_login_at: new Date()
      },
      token,
      refresh_token: refreshToken
    };
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(id: number): Promise<UserAttributes | null> {
    return await User.findByPk(id);
  }

  /**
   * 根据用户名获取用户信息
   */
  static async getUserByUsername(username: string): Promise<UserAttributes | null> {
    return await User.findOne({
      where: { username }
    });
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: number, data: Partial<UserAttributes>): Promise<UserAttributes | null> {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }

    await user.update(data);
    return user.toJSON();
  }

  /**
   * 生成JWT访问令牌
   */
  private static generateToken(userId: number): string {
    return jwt.sign(
      { userId, type: 'access' },
      process.env['JWT_SECRET'] || 'fallback-secret',
      { expiresIn: process.env['JWT_EXPIRES_IN'] || '15m' }
    );
  }

  /**
   * 生成JWT刷新令牌
   */
  private static generateRefreshToken(userId: number): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      process.env['JWT_SECRET'] || 'fallback-secret',
      { expiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d' }
    );
  }

  /**
   * 验证JWT令牌
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret');
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }

  /**
   * 刷新访问令牌
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string; refresh_token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env['JWT_SECRET'] || 'fallback-secret') as any;
      
      if (decoded.type !== 'refresh') {
        throw new Error('无效的刷新令牌');
      }

      const user = await User.findByPk(decoded.userId);
      if (!user || user.status !== 'active') {
        throw new Error('用户不存在或已被禁用');
      }

      const newToken = this.generateToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);

      return {
        token: newToken,
        refresh_token: newRefreshToken
      };
    } catch (error) {
      throw new Error('刷新令牌失败');
    }
  }
} 