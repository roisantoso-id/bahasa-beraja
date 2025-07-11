"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试'
    }
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PiMiBahasa API',
            version: '1.0.0',
            description: 'PiMiBahasa 印尼语学习平台后端API文档',
            contact: {
                name: 'PiMiBahasa Team',
                email: 'support@pimibahasa.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: '开发服务器'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'PiMiBahasa API 服务运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '欢迎使用 PiMiBahasa API',
        version: '1.0.0',
        documentation: `/api-docs`
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.originalUrl
    });
});
app.use((error, req, res, next) => {
    console.error('全局错误:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});
const startServer = async () => {
    try {
        await (0, database_1.testConnection)();
        app.listen(PORT, () => {
            console.log(`🚀 PiMiBahasa API 服务器启动成功`);
            console.log(`📍 服务地址: http://localhost:${PORT}`);
            console.log(`📚 API文档: http://localhost:${PORT}/api-docs`);
            console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
            console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
        });
    }
    catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map