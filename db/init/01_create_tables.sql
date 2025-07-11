-- PiMiBahasa 数据库初始化脚本
-- 创建时间: 2024-07-11
-- 数据库: MySQL 8.0+

-- 创建数据库
CREATE DATABASE IF NOT EXISTS pimi_bahasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pimi_bahasa;

-- 1. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(64) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(128) UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) COMMENT '密码哈希（预留）',
    display_name VARCHAR(128) NOT NULL COMMENT '显示昵称',
    avatar_url VARCHAR(256) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    country VARCHAR(64) DEFAULT 'CN' COMMENT '国家/地区',
    language VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言偏好',
    timezone VARCHAR(32) DEFAULT 'Asia/Shanghai' COMMENT '时区',
    
    -- 用户状态相关
    status ENUM('active', 'disabled', 'pending') DEFAULT 'active' COMMENT '用户状态',
    role ENUM('user', 'vip', 'admin', 'super_admin') DEFAULT 'user' COMMENT '用户角色',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    phone_verified BOOLEAN DEFAULT FALSE COMMENT '手机是否验证',
    
    -- 付费充值相关字段
    balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额（元）',
    vip_level INT DEFAULT 0 COMMENT 'VIP等级 0-普通用户 1-5 VIP等级',
    vip_expire_at TIMESTAMP NULL COMMENT 'VIP到期时间',
    total_recharge DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计充值金额',
    total_consumption DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计消费金额',
    
    -- 学习统计相关
    login_count INT DEFAULT 0 COMMENT '登录次数',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    total_study_time INT DEFAULT 0 COMMENT '总学习时间（分钟）',
    streak_days INT DEFAULT 0 COMMENT '连续学习天数',
    longest_streak INT DEFAULT 0 COMMENT '最长连续学习天数',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_vip_level (vip_level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 词汇掌握表 (vocabulary_mastery)
CREATE TABLE IF NOT EXISTS vocabulary_mastery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    word_id VARCHAR(128) NOT NULL COMMENT '词汇ID',
    category_id VARCHAR(64) NOT NULL COMMENT '分类ID',
    word VARCHAR(128) NOT NULL COMMENT '词汇',
    translation VARCHAR(256) NOT NULL COMMENT '翻译',
    
    -- 掌握程度
    mastery_level INT DEFAULT 0 COMMENT '掌握等级 0-未学习 1-认识 2-理解 3-掌握',
    review_count INT DEFAULT 0 COMMENT '复习次数',
    correct_count INT DEFAULT 0 COMMENT '正确次数',
    wrong_count INT DEFAULT 0 COMMENT '错误次数',
    accuracy_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT '正确率',
    
    -- 学习时间
    first_learned_at TIMESTAMP NULL COMMENT '首次学习时间',
    last_reviewed_at TIMESTAMP NULL COMMENT '最后复习时间',
    next_review_at TIMESTAMP NULL COMMENT '下次复习时间',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    UNIQUE KEY uk_user_word (user_id, word_id),
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_mastery_level (mastery_level),
    INDEX idx_next_review (next_review_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='词汇掌握表';

-- 3. 测验历史表 (quiz_history)
CREATE TABLE IF NOT EXISTS quiz_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    quiz_type ENUM('vocabulary', 'grammar', 'business', 'mixed') NOT NULL COMMENT '测验类型',
    category_id VARCHAR(64) COMMENT '分类ID',
    
    -- 测验结果
    total_questions INT NOT NULL COMMENT '总题数',
    correct_answers INT NOT NULL COMMENT '正确题数',
    score DECIMAL(5,2) NOT NULL COMMENT '得分',
    time_spent INT DEFAULT 0 COMMENT '用时（秒）',
    passed BOOLEAN DEFAULT FALSE COMMENT '是否通过',
    
    -- 详细结果（JSON格式存储）
    questions_detail JSON COMMENT '题目详情',
    answers_detail JSON COMMENT '答案详情',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_type (quiz_type),
    INDEX idx_category_id (category_id),
    INDEX idx_created_at (created_at),
    INDEX idx_score (score),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测验历史表';

-- 4. 学习统计表 (learning_stats)
CREATE TABLE IF NOT EXISTS learning_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    date DATE NOT NULL COMMENT '学习日期',
    
    -- 学习数据
    study_time INT DEFAULT 0 COMMENT '学习时间（分钟）',
    words_learned INT DEFAULT 0 COMMENT '学习词汇数',
    words_mastered INT DEFAULT 0 COMMENT '掌握词汇数',
    quizzes_taken INT DEFAULT 0 COMMENT '测验次数',
    quizzes_passed INT DEFAULT 0 COMMENT '通过测验数',
    average_score DECIMAL(5,2) DEFAULT 0.00 COMMENT '平均分数',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    UNIQUE KEY uk_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习统计表';

-- 5. 充值订单表 (recharge_orders)
CREATE TABLE IF NOT EXISTS recharge_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    order_no VARCHAR(64) UNIQUE NOT NULL COMMENT '订单号',
    
    -- 充值信息
    amount DECIMAL(10,2) NOT NULL COMMENT '充值金额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币类型',
    payment_method ENUM('alipay', 'wechat', 'bank_card', 'other') COMMENT '支付方式',
    payment_channel VARCHAR(64) COMMENT '支付渠道',
    
    -- 订单状态
    status ENUM('pending', 'paid', 'failed', 'cancelled', 'refunded') DEFAULT 'pending' COMMENT '订单状态',
    paid_at TIMESTAMP NULL COMMENT '支付时间',
    transaction_id VARCHAR(128) COMMENT '第三方交易ID',
    
    -- 商品信息
    product_type ENUM('balance', 'vip', 'course', 'other') NOT NULL COMMENT '商品类型',
    product_id VARCHAR(64) COMMENT '商品ID',
    product_name VARCHAR(128) COMMENT '商品名称',
    product_description TEXT COMMENT '商品描述',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_transaction_id (transaction_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='充值订单表';

-- 6. 消费记录表 (consumption_records)
CREATE TABLE IF NOT EXISTS consumption_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    order_id BIGINT COMMENT '关联订单ID',
    
    -- 消费信息
    amount DECIMAL(10,2) NOT NULL COMMENT '消费金额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币类型',
    consumption_type ENUM('course', 'feature', 'vip', 'other') NOT NULL COMMENT '消费类型',
    product_id VARCHAR(64) COMMENT '商品ID',
    product_name VARCHAR(128) COMMENT '商品名称',
    description TEXT COMMENT '消费描述',
    
    -- 余额变化
    balance_before DECIMAL(10,2) NOT NULL COMMENT '消费前余额',
    balance_after DECIMAL(10,2) NOT NULL COMMENT '消费后余额',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_consumption_type (consumption_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES recharge_orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消费记录表';

-- 7. VIP套餐表 (vip_packages)
CREATE TABLE IF NOT EXISTS vip_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '套餐ID',
    name VARCHAR(128) NOT NULL COMMENT '套餐名称',
    description TEXT COMMENT '套餐描述',
    
    -- 套餐信息
    duration_days INT NOT NULL COMMENT '有效期（天）',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    original_price DECIMAL(10,2) COMMENT '原价',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '货币类型',
    
    -- 权益信息
    features JSON COMMENT '权益详情（JSON格式）',
    max_level INT DEFAULT 1 COMMENT 'VIP等级',
    
    -- 状态
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    sort_order INT DEFAULT 0 COMMENT '排序',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='VIP套餐表';

-- 8. 用户行为日志表 (user_activity_logs)
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID（可为空，表示游客）',
    
    -- 行为信息
    action VARCHAR(64) NOT NULL COMMENT '行为类型',
    resource_type VARCHAR(64) COMMENT '资源类型',
    resource_id VARCHAR(128) COMMENT '资源ID',
    details JSON COMMENT '详细信息（JSON格式）',
    
    -- 客户端信息
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    device_type VARCHAR(32) COMMENT '设备类型',
    platform VARCHAR(32) COMMENT '平台',
    
    -- 系统字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_resource (resource_type, resource_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为日志表';

-- 插入默认VIP套餐数据
INSERT INTO vip_packages (name, description, duration_days, price, original_price, features, max_level, sort_order) VALUES
('月度VIP', '享受30天VIP特权', 30, 29.90, 39.90, '["unlimited_quizzes", "advanced_features", "priority_support"]', 1, 1),
('季度VIP', '享受90天VIP特权', 90, 79.90, 119.70, '["unlimited_quizzes", "advanced_features", "priority_support", "exclusive_content"]', 2, 2),
('年度VIP', '享受365天VIP特权', 365, 299.90, 479.40, '["unlimited_quizzes", "advanced_features", "priority_support", "exclusive_content", "personal_tutor"]', 3, 3);

-- 创建索引优化查询性能
CREATE INDEX idx_users_composite ON users(status, role, vip_level);
CREATE INDEX idx_vocabulary_mastery_composite ON vocabulary_mastery(user_id, category_id, mastery_level);
CREATE INDEX idx_quiz_history_composite ON quiz_history(user_id, quiz_type, created_at);
CREATE INDEX idx_learning_stats_composite ON learning_stats(user_id, date); 