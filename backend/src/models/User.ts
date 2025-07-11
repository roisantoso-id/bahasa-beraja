import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 用户接口定义
export interface UserAttributes {
  id: number;
  username: string;
  email?: string;
  password_hash?: string;
  display_name: string;
  avatar_url?: string;
  phone?: string;
  country: string;
  language: string;
  timezone: string;
  status: 'active' | 'disabled' | 'pending';
  role: 'user' | 'vip' | 'admin' | 'super_admin';
  email_verified: boolean;
  phone_verified: boolean;
  balance: number;
  vip_level: number;
  vip_expire_at?: Date;
  total_recharge: number;
  total_consumption: number;
  login_count: number;
  last_login_at?: Date;
  total_study_time: number;
  streak_days: number;
  longest_streak: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

// 创建用户时的可选字段
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email?: string;
  public password_hash?: string;
  public display_name!: string;
  public avatar_url?: string;
  public phone?: string;
  public country!: string;
  public language!: string;
  public timezone!: string;
  public status!: 'active' | 'disabled' | 'pending';
  public role!: 'user' | 'vip' | 'admin' | 'super_admin';
  public email_verified!: boolean;
  public phone_verified!: boolean;
  public balance!: number;
  public vip_level!: number;
  public vip_expire_at?: Date;
  public total_recharge!: number;
  public total_consumption!: number;
  public login_count!: number;
  public last_login_at?: Date;
  public total_study_time!: number;
  public streak_days!: number;
  public longest_streak!: number;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;

  // 实例方法
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      comment: '用户ID'
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
      comment: '邮箱'
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '密码哈希'
    },
    display_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '显示昵称'
    },
    avatar_url: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: '头像URL'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    country: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: 'CN',
      comment: '国家/地区'
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'zh-CN',
      comment: '语言偏好'
    },
    timezone: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'Asia/Shanghai',
      comment: '时区'
    },
    status: {
      type: DataTypes.ENUM('active', 'disabled', 'pending'),
      allowNull: false,
      defaultValue: 'active',
      comment: '用户状态'
    },
    role: {
      type: DataTypes.ENUM('user', 'vip', 'admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'user',
      comment: '用户角色'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '邮箱是否验证'
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '手机是否验证'
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '账户余额'
    },
    vip_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'VIP等级'
    },
    vip_expire_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'VIP到期时间'
    },
    total_recharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '累计充值金额'
    },
    total_consumption: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: '累计消费金额'
    },
    login_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '登录次数'
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间'
    },
    total_study_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '总学习时间（分钟）'
    },
    streak_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '连续学习天数'
    },
    longest_streak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '最长连续学习天数'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '创建时间'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '更新时间'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '软删除时间'
    }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    paranoid: true, // 启用软删除
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['role']
      },
      {
        fields: ['vip_level']
      },
      {
        fields: ['created_at']
      }
    ]
  }
);

export default User; 