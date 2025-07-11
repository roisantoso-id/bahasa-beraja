"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        comment: '用户ID'
    },
    username: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        comment: '用户名'
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        unique: true,
        comment: '邮箱'
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        comment: '密码哈希'
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        comment: '显示昵称'
    },
    avatar_url: {
        type: sequelize_1.DataTypes.STRING(256),
        allowNull: true,
        comment: '头像URL'
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        comment: '手机号'
    },
    country: {
        type: sequelize_1.DataTypes.STRING(64),
        allowNull: false,
        defaultValue: 'CN',
        comment: '国家/地区'
    },
    language: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'zh-CN',
        comment: '语言偏好'
    },
    timezone: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'Asia/Shanghai',
        comment: '时区'
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'disabled', 'pending'),
        allowNull: false,
        defaultValue: 'active',
        comment: '用户状态'
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'vip', 'admin', 'super_admin'),
        allowNull: false,
        defaultValue: 'user',
        comment: '用户角色'
    },
    email_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '邮箱是否验证'
    },
    phone_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '手机是否验证'
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: '账户余额'
    },
    vip_level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'VIP等级'
    },
    vip_expire_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'VIP到期时间'
    },
    total_recharge: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: '累计充值金额'
    },
    total_consumption: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: '累计消费金额'
    },
    login_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '登录次数'
    },
    last_login_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: '最后登录时间'
    },
    total_study_time: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总学习时间（分钟）'
    },
    streak_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '连续学习天数'
    },
    longest_streak: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '最长连续学习天数'
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        comment: '创建时间'
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        comment: '更新时间'
    },
    deleted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: '软删除时间'
    }
}, {
    sequelize: database_1.default,
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    paranoid: true,
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
});
exports.default = User;
//# sourceMappingURL=User.js.map