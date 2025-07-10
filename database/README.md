# Bahasa Beraja 数据库配置文档

## 📖 概述

这个文档包含了 Bahasa Beraja 项目数据库的完整配置信息，包括 PostgreSQL 数据库和 pgAdmin 管理界面的设置。

## 🚀 快速启动

### 启动数据库服务
```bash
cd database
docker-compose up -d
```

### 停止数据库服务
```bash
cd database
docker-compose down
```

### 查看服务状态
```bash
cd database
docker-compose ps
```

## 🗄️ 数据库架构

### 基本信息
- **数据库引擎**: PostgreSQL 15
- **数据库名**: `bahasa_beraja`
- **用户名**: `bahasa_user`
- **密码**: `bahasa_pass_2024`
- **端口**: `5432`
- **数据持久化路径**: `/home/data/bahasa-beraja-postgres`

### 管理界面 (pgAdmin)
- **访问地址**: http://localhost:5050
- **邮箱**: admin@bahasa.local
- **密码**: admin123456
- **数据持久化路径**: `/home/data/bahasa-beraja-pgadmin`

## 📊 数据表结构

### 1. 用户表 (users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL DEFAULT 'default_user',
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    registration_ip INET,
    last_login_ip INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 用户进度表 (user_progress)
```sql
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    current_category INTEGER DEFAULT 0,
    current_word INTEGER DEFAULT 0,
    total_study_time INTEGER DEFAULT 0,
    words_learned INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_study_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 3. 词汇掌握表 (vocabulary_mastery)
```sql
CREATE TABLE vocabulary_mastery (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    category_id INTEGER NOT NULL,
    word_index INTEGER NOT NULL,
    mastery_level INTEGER DEFAULT 0, -- 0: 未学习, 1: 初学, 2: 熟悉, 3: 掌握
    review_count INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, word_index),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 4. 学习统计表 (learning_stats)
```sql
CREATE TABLE learning_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    total_study_days INTEGER DEFAULT 0,
    total_study_time INTEGER DEFAULT 0,
    words_learned INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 5. 测验历史表 (quiz_history)
```sql
CREATE TABLE quiz_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'default_user',
    score INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    time_limit BOOLEAN DEFAULT FALSE,
    total_time INTEGER DEFAULT 0,
    answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 6. 用户会话表 (user_sessions)
```sql
CREATE TABLE user_sessions (
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
```

### 7. 用户角色表 (user_roles)
```sql
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    role_name VARCHAR(50) NOT NULL DEFAULT 'user',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, role_name)
);
```

### 8. 登录日志表 (login_logs)
```sql
CREATE TABLE login_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. 密码重置表 (password_resets)
```sql
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## 🔗 重要视图

### 用户学习概览视图
```sql
CREATE OR REPLACE VIEW user_learning_overview AS
SELECT 
    u.user_id,
    up.current_category,
    up.current_word,
    up.total_study_time,
    up.words_learned,
    up.streak,
    up.last_study_date,
    ls.total_study_days,
    ls.quizzes_taken,
    ls.average_score,
    COUNT(vm.id) as total_words_studied,
    COUNT(CASE WHEN vm.mastery_level >= 3 THEN 1 END) as mastered_words
FROM users u
LEFT JOIN user_progress up ON u.user_id = up.user_id
LEFT JOIN learning_stats ls ON u.user_id = ls.user_id
LEFT JOIN vocabulary_mastery vm ON u.user_id = vm.user_id
GROUP BY u.user_id, up.current_category, up.current_word, up.total_study_time, 
         up.words_learned, up.streak, up.last_study_date, ls.total_study_days, 
         ls.quizzes_taken, ls.average_score;
```

### 用户完整信息视图
```sql
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
```

## ⚙️ 重要函数

### 1. 计算学习连续天数
```sql
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id VARCHAR(100))
RETURNS INTEGER AS $$
DECLARE
    last_study_date DATE;
    current_date_val DATE;
    streak_count INTEGER;
BEGIN
    SELECT DATE(last_study_date) INTO last_study_date 
    FROM user_progress 
    WHERE user_id = p_user_id;
    
    current_date_val := CURRENT_DATE;
    
    IF last_study_date IS NULL THEN
        RETURN 0;
    END IF;
    
    IF current_date_val - last_study_date <= 1 THEN
        SELECT streak INTO streak_count 
        FROM user_progress 
        WHERE user_id = p_user_id;
        
        RETURN COALESCE(streak_count, 0);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2. 更新学习统计
```sql
CREATE OR REPLACE FUNCTION update_learning_statistics(p_user_id VARCHAR(100))
RETURNS VOID AS $$
DECLARE
    total_words_learned INTEGER;
    mastered_words INTEGER;
    total_quizzes INTEGER;
    avg_score DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO total_words_learned
    FROM vocabulary_mastery
    WHERE user_id = p_user_id AND mastery_level >= 1;
    
    SELECT COUNT(*) INTO mastered_words
    FROM vocabulary_mastery
    WHERE user_id = p_user_id AND mastery_level >= 3;
    
    SELECT COUNT(*), AVG(score) INTO total_quizzes, avg_score
    FROM quiz_history
    WHERE user_id = p_user_id;
    
    UPDATE learning_stats 
    SET 
        words_learned = total_words_learned,
        quizzes_taken = COALESCE(total_quizzes, 0),
        average_score = COALESCE(avg_score, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    UPDATE user_progress 
    SET 
        words_learned = total_words_learned,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. 清理过期会话
```sql
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
```

### 4. 验证用户权限
```sql
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id VARCHAR(100), p_permission VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id AND is_admin = TRUE AND is_active = TRUE) THEN
        RETURN TRUE;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = p_user_id AND role_name = p_permission
    );
END;
$$ LANGUAGE plpgsql;
```

## 🔐 默认账户

### 管理员账户
- **用户ID**: admin
- **邮箱**: admin@bahasa.local
- **角色**: admin
- **状态**: 激活

### 测试用户账户
- **邮箱**: test@example.com
- **密码**: Test123456
- **角色**: user

## 🌐 网络配置

数据库服务使用独立的 Docker 网络：
- **网络名**: `bahasa_db_network`
- **驱动**: bridge

前端服务通过外部网络连接：
```yaml
networks:
  bahasa_db_network:
    external: true
```

## 📂 文件结构

```
database/
├── docker-compose.yml    # 数据库服务配置
├── init-db.sql          # 初始化脚本
├── upgrade-db.sql       # 升级脚本
└── README.md           # 本文档
```

## 🔄 重新初始化数据库

如果需要完全重新初始化数据库：

```bash
# 1. 停止服务
cd database
docker-compose down

# 2. 删除数据（注意：这会丢失所有数据！）
sudo rm -rf /home/data/bahasa-beraja-postgres/*
sudo rm -rf /home/data/bahasa-beraja-pgadmin/*

# 3. 重新启动服务
docker-compose up -d

# 4. 查看日志确认初始化完成
docker-compose logs -f postgres
```

## 📝 连接字符串示例

### Node.js 应用连接
```javascript
const connectionString = "postgresql://bahasa_user:bahasa_pass_2024@localhost:5432/bahasa_beraja";
```

### 环境变量配置
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bahasa_beraja
DB_USER=bahasa_user
DB_PASSWORD=bahasa_pass_2024
```

## 🚨 备份建议

定期备份数据库：
```bash
# 创建备份
docker exec bahasa-beraja-db pg_dump -U bahasa_user -d bahasa_beraja > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复备份
docker exec -i bahasa-beraja-db psql -U bahasa_user -d bahasa_beraja < backup.sql
```

## 🔧 故障排除

### 连接问题
1. 确认服务正在运行：`docker-compose ps`
2. 检查网络连接：`docker network ls`
3. 查看日志：`docker-compose logs postgres`

### 权限问题
确保数据目录权限正确：
```bash
sudo chown 999:999 /home/data/bahasa-beraja-postgres
sudo chown 5050:5050 /home/data/bahasa-beraja-pgadmin
```

---

**最后更新**: 2024年12月
**版本**: v1.0 