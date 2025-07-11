"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
class UserService {
    static async register(data) {
        const existingUser = await User_1.default.findOne({
            where: { username: data.username }
        });
        if (existingUser) {
            throw new Error('用户名已存在');
        }
        if (data.email) {
            const existingEmail = await User_1.default.findOne({
                where: { email: data.email }
            });
            if (existingEmail) {
                throw new Error('邮箱已被注册');
            }
        }
        let passwordHash;
        if (data.password) {
            const saltRounds = 12;
            passwordHash = await bcryptjs_1.default.hash(data.password, saltRounds);
        }
        const userData = {
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
        const user = await User_1.default.create(userData);
        const token = this.generateToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);
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
    static async login(data) {
        const user = await User_1.default.findOne({
            where: { username: data.username }
        });
        if (!user) {
            throw new Error('用户名或密码错误');
        }
        if (user.status !== 'active') {
            throw new Error('账户已被禁用或待激活');
        }
        if (user.password_hash) {
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password_hash);
            if (!isPasswordValid) {
                throw new Error('用户名或密码错误');
            }
        }
        else {
            throw new Error('该账户不支持密码登录，请使用其他方式登录');
        }
        const token = this.generateToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);
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
    static async getUserById(id) {
        return await User_1.default.findByPk(id);
    }
    static async getUserByUsername(username) {
        return await User_1.default.findOne({
            where: { username }
        });
    }
    static async updateUser(id, data) {
        const user = await User_1.default.findByPk(id);
        if (!user) {
            return null;
        }
        await user.update(data);
        return user.toJSON();
    }
    static generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'access' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
    }
    static generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        }
        catch (error) {
            throw new Error('无效的令牌');
        }
    }
    static async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || 'fallback-secret');
            if (decoded.type !== 'refresh') {
                throw new Error('无效的刷新令牌');
            }
            const user = await User_1.default.findByPk(decoded.userId);
            if (!user || user.status !== 'active') {
                throw new Error('用户不存在或已被禁用');
            }
            const newToken = this.generateToken(user.id);
            const newRefreshToken = this.generateRefreshToken(user.id);
            return {
                token: newToken,
                refresh_token: newRefreshToken
            };
        }
        catch (error) {
            throw new Error('刷新令牌失败');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map