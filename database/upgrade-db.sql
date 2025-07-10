-- Bahasa Beraja 数据库升级脚本
-- 增强用户表结构以支持邮箱密码注册登录

-- 1. 备份现有用户数据（如果有的话）
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;

-- 2. 增强用户表结构
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS registration_ip INET,
ADD COLUMN IF NOT EXISTS last_login_ip INET;

-- 3. 添加唯一约束
ALTER TABLE users 
ADD CONSTRAINT users_email_unique UNIQUE (email);

-- 4. 创建用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. 创建用户权限表（为将来的角色管理做准备）
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    role_name VARCHAR(50) NOT NULL DEFAULT 'user',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, role_name)
);

-- 6. 创建登录日志表
CREATE TABLE IF NOT EXISTS login_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 添加索引优化
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON login_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- 8. 为新表添加更新时间戳触发器
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. 创建管理员用户（如果不存在）
INSERT INTO users (user_id, email, display_name, is_admin, is_active, email_verified) 
VALUES ('admin', 'admin@bahasa.local', 'Administrator', TRUE, TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- 10. 为管理员分配角色
INSERT INTO user_roles (user_id, role_name, granted_by)
VALUES ('admin', 'admin', 'system')
ON CONFLICT (user_id, role_name) DO NOTHING;

-- 11. 创建用于密码重置的表（暂时保留，将来可能需要）
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at);

-- 12. 创建视图：用户完整信息
CREATE OR REPLACE VIEW user_profile_view AS
SELECT 
    u.user_id,
    u.email,
    u.display_name,
    u.avatar_url,
    u.is_active,
    u.is_admin,
    u.email_verified,
    u.last_login_at,
    u.login_count,
    u.created_at,
    u.updated_at,
    STRING_AGG(ur.role_name, ', ') as roles,
    up.current_category,
    up.current_word,
    up.total_study_time,
    up.words_learned,
    up.streak,
    ls.quizzes_taken,
    ls.average_score
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN user_progress up ON u.user_id = up.user_id
LEFT JOIN learning_stats ls ON u.user_id = ls.user_id
GROUP BY u.user_id, u.email, u.display_name, u.avatar_url, u.is_active, 
         u.is_admin, u.email_verified, u.last_login_at, u.login_count,
         u.created_at, u.updated_at, up.current_category, up.current_word,
         up.total_study_time, up.words_learned, up.streak, 
         ls.quizzes_taken, ls.average_score;

-- 13. 创建函数：清理过期会话
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 14. 创建函数：验证用户权限
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id VARCHAR(100), p_permission VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    -- 检查是否是管理员
    IF EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id AND is_admin = TRUE AND is_active = TRUE) THEN
        RETURN TRUE;
    END IF;
    
    -- 检查特定权限
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = p_user_id AND role_name = p_permission
    );
END;
$$ LANGUAGE plpgsql;

-- 15. 输出升级完成信息
DO $$
BEGIN
    RAISE NOTICE '数据库升级完成！';
    RAISE NOTICE '新增表：user_sessions, user_roles, login_logs, password_resets';
    RAISE NOTICE '增强用户表：添加email, password_hash, display_name等字段';
    RAISE NOTICE '创建视图：user_profile_view';
    RAISE NOTICE '创建函数：cleanup_expired_sessions, user_has_permission';
END $$; 