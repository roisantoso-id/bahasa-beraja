"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/register', userController_1.UserController.register);
router.post('/login', userController_1.UserController.login);
router.post('/refresh', userController_1.UserController.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.js.map