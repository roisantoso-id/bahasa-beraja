"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const joi_1 = __importDefault(require("joi"));
const userService_1 = require("../services/userService");
const registerSchema = joi_1.default.object({
    username: joi_1.default.string()
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
    email: joi_1.default.string()
        .email()
        .optional()
        .messages({
        'string.email': '邮箱格式不正确'
    }),
    password: joi_1.default.string()
        .min(6)
        .max(50)
        .optional()
        .messages({
        'string.min': '密码至少6个字符',
        'string.max': '密码最多50个字符'
    }),
    display_name: joi_1.default.string()
        .min(2)
        .max(50)
        .required()
        .messages({
        'string.min': '昵称至少2个字符',
        'string.max': '昵称最多50个字符',
        'any.required': '昵称是必填项'
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .optional()
        .messages({
        'string.pattern.base': '手机号格式不正确'
    }),
    country: joi_1.default.string()
        .length(2)
        .optional()
        .messages({
        'string.length': '国家代码必须是2个字符'
    }),
    language: joi_1.default.string()
        .pattern(/^[a-z]{2}-[A-Z]{2}$/)
        .optional()
        .messages({
        'string.pattern.base': '语言代码格式不正确，应为 xx-XX'
    }),
    timezone: joi_1.default.string()
        .optional()
});
const loginSchema = joi_1.default.object({
    username: joi_1.default.string()
        .required()
        .messages({
        'any.required': '用户名是必填项'
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': '密码是必填项'
    })
});
class UserController {
    static async register(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: '请求数据验证失败',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const registerData = value;
            const result = await userService_1.UserService.register(registerData);
            res.status(201).json({
                success: true,
                message: '注册成功',
                data: result
            });
        }
        catch (error) {
            console.error('注册失败:', error);
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '服务器内部错误'
                });
            }
        }
    }
    static async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: '请求数据验证失败',
                    errors: error.details.map(detail => detail.message)
                });
                return;
            }
            const loginData = value;
            const result = await userService_1.UserService.login(loginData);
            res.status(200).json({
                success: true,
                message: '登录成功',
                data: result
            });
        }
        catch (error) {
            console.error('登录失败:', error);
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '服务器内部错误'
                });
            }
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refresh_token } = req.body;
            if (!refresh_token) {
                res.status(400).json({
                    success: false,
                    message: '刷新令牌是必填项'
                });
                return;
            }
            const result = await userService_1.UserService.refreshToken(refresh_token);
            res.status(200).json({
                success: true,
                message: '令牌刷新成功',
                data: result
            });
        }
        catch (error) {
            console.error('令牌刷新失败:', error);
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: '服务器内部错误'
                });
            }
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: '未授权访问'
                });
                return;
            }
            const user = await userService_1.UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            const { password_hash, ...userInfo } = user;
            res.status(200).json({
                success: true,
                message: '获取用户信息成功',
                data: userInfo
            });
        }
        catch (error) {
            console.error('获取用户信息失败:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: '未授权访问'
                });
                return;
            }
            const allowedFields = ['display_name', 'avatar_url', 'phone', 'country', 'language', 'timezone'];
            const updateData = {};
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
            const updatedUser = await userService_1.UserService.updateUser(userId, updateData);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: '用户不存在'
                });
                return;
            }
            const { password_hash, ...userInfo } = updatedUser;
            res.status(200).json({
                success: true,
                message: '用户信息更新成功',
                data: userInfo
            });
        }
        catch (error) {
            console.error('更新用户信息失败:', error);
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map