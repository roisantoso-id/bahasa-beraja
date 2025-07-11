"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireVIP = exports.requireRole = exports.authenticateToken = void 0;
const userService_1 = require("../services/userService");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: '访问令牌缺失'
            });
            return;
        }
        const decoded = userService_1.UserService.verifyToken(token);
        if (decoded.type !== 'access') {
            res.status(401).json({
                success: false,
                message: '无效的访问令牌'
            });
            return;
        }
        req.user = {
            userId: decoded.userId,
            type: decoded.type
        };
        next();
    }
    catch (error) {
        console.error('令牌验证失败:', error);
        res.status(401).json({
            success: false,
            message: '无效的访问令牌'
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: '未授权访问'
                });
                return;
            }
            const user = await userService_1.UserService.getUserById(req.user.userId);
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
        }
        catch (error) {
            console.error('角色验证失败:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    };
};
exports.requireRole = requireRole;
const requireVIP = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: '未授权访问'
            });
            return;
        }
        const user = await userService_1.UserService.getUserById(req.user.userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: '用户不存在'
            });
            return;
        }
        if (user.vip_level === 0 || (user.vip_expire_at && new Date() > user.vip_expire_at)) {
            res.status(403).json({
                success: false,
                message: '需要VIP会员才能访问此功能'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('VIP验证失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};
exports.requireVIP = requireVIP;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                const decoded = userService_1.UserService.verifyToken(token);
                if (decoded.type === 'access') {
                    req.user = {
                        userId: decoded.userId,
                        type: decoded.type
                    };
                }
            }
            catch (error) {
                console.warn('可选认证令牌无效:', error);
            }
        }
        next();
    }
    catch (error) {
        console.error('可选认证失败:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map