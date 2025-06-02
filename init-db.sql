-- Bahasa Beraja 数据库初始化脚本
-- 创建用户学习数据表

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL DEFAULT 'default_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
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

-- 词汇掌握程度表
CREATE TABLE IF NOT EXISTS vocabulary_mastery (
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

-- 学习统计表
CREATE TABLE IF NOT EXISTS learning_stats (
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

-- 测验历史表
CREATE TABLE IF NOT EXISTS quiz_history (
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery_user_id ON vocabulary_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery_category ON vocabulary_mastery(category_id);
CREATE INDEX IF NOT EXISTS idx_learning_stats_user_id ON learning_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_created_at ON quiz_history(created_at);

-- 插入默认用户
INSERT INTO users (user_id) VALUES ('default_user') ON CONFLICT DO NOTHING;

-- 插入默认学习进度
INSERT INTO user_progress (user_id) VALUES ('default_user') ON CONFLICT DO NOTHING;

-- 插入默认学习统计
INSERT INTO learning_stats (user_id) VALUES ('default_user') ON CONFLICT DO NOTHING;

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vocabulary_mastery_updated_at BEFORE UPDATE ON vocabulary_mastery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_stats_updated_at BEFORE UPDATE ON learning_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建视图：用户学习概览
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

-- 创建函数：计算学习连续天数
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id VARCHAR(100))
RETURNS INTEGER AS $$
DECLARE
    last_study_date DATE;
    current_date_val DATE;
    streak_count INTEGER;
BEGIN
    -- 获取最后学习日期
    SELECT DATE(last_study_date) INTO last_study_date 
    FROM user_progress 
    WHERE user_id = p_user_id;
    
    -- 获取当前日期
    current_date_val := CURRENT_DATE;
    
    -- 如果没有学习记录，返回0
    IF last_study_date IS NULL THEN
        RETURN 0;
    END IF;
    
    -- 计算天数差
    IF current_date_val - last_study_date <= 1 THEN
        -- 获取当前连续天数
        SELECT streak INTO streak_count 
        FROM user_progress 
        WHERE user_id = p_user_id;
        
        RETURN COALESCE(streak_count, 0);
    ELSE
        -- 连续中断
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：更新学习统计
CREATE OR REPLACE FUNCTION update_learning_statistics(p_user_id VARCHAR(100))
RETURNS VOID AS $$
DECLARE
    total_words_learned INTEGER;
    mastered_words INTEGER;
    total_quizzes INTEGER;
    avg_score DECIMAL(5,2);
BEGIN
    -- 计算学习词汇总数
    SELECT COUNT(*) INTO total_words_learned
    FROM vocabulary_mastery
    WHERE user_id = p_user_id AND mastery_level >= 1;
    
    -- 计算掌握词汇总数
    SELECT COUNT(*) INTO mastered_words
    FROM vocabulary_mastery
    WHERE user_id = p_user_id AND mastery_level >= 3;
    
    -- 计算测验统计
    SELECT COUNT(*), AVG(score) INTO total_quizzes, avg_score
    FROM quiz_history
    WHERE user_id = p_user_id;
    
    -- 更新学习统计表
    UPDATE learning_stats 
    SET 
        words_learned = total_words_learned,
        quizzes_taken = COALESCE(total_quizzes, 0),
        average_score = COALESCE(avg_score, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    -- 更新用户进度表
    UPDATE user_progress 
    SET 
        words_learned = total_words_learned,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON DATABASE bahasa_beraja IS 'Bahasa Beraja - 印尼语学习平台数据库';
COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE user_progress IS '用户学习进度表';
COMMENT ON TABLE vocabulary_mastery IS '词汇掌握程度表';
COMMENT ON TABLE learning_stats IS '学习统计表';
COMMENT ON TABLE quiz_history IS '测验历史表'; 