-- PiMiBahasa 数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS pimi_bahasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE pimi_bahasa;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(64) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(128) UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) COMMENT '密码哈希',
    display_name VARCHAR(128) NOT NULL COMMENT '显示昵称',
    avatar_url VARCHAR(256) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    country VARCHAR(64) NOT NULL DEFAULT 'CN' COMMENT '国家/地区',
    language VARCHAR(10) NOT NULL DEFAULT 'zh-CN' COMMENT '语言偏好',
    timezone VARCHAR(32) NOT NULL DEFAULT 'Asia/Shanghai' COMMENT '时区',
    status ENUM('active', 'disabled', 'pending') NOT NULL DEFAULT 'active' COMMENT '用户状态',
    role ENUM('user', 'vip', 'admin', 'super_admin') NOT NULL DEFAULT 'user' COMMENT '用户角色',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '邮箱是否验证',
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '手机是否验证',
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
    vip_level INT NOT NULL DEFAULT 0 COMMENT 'VIP等级',
    vip_expire_at DATETIME COMMENT 'VIP到期时间',
    total_recharge DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计充值金额',
    total_consumption DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '累计消费金额',
    login_count INT NOT NULL DEFAULT 0 COMMENT '登录次数',
    last_login_at DATETIME COMMENT '最后登录时间',
    total_study_time INT NOT NULL DEFAULT 0 COMMENT '总学习时间（分钟）',
    streak_days INT NOT NULL DEFAULT 0 COMMENT '连续学习天数',
    longest_streak INT NOT NULL DEFAULT 0 COMMENT '最长连续学习天数',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at DATETIME COMMENT '软删除时间',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_vip_level (vip_level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入测试用户数据
INSERT INTO users (username, email, password_hash, display_name, role, status) VALUES
('admin', 'admin@pimibahasa.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS.Oe', '管理员', 'admin', 'active'),
('testuser', 'test@pimibahasa.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS.Oe', '测试用户', 'user', 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- 显示创建结果
SELECT 'PiMiBahasa 数据库初始化完成' AS message;
SELECT COUNT(*) AS user_count FROM users; 