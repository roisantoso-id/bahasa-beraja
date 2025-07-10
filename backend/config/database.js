const { Pool } = require('pg');

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bahasa_beraja',
  user: process.env.DB_USER || 'bahasa_user',
  password: process.env.DB_PASSWORD || 'bahasa_pass_2024',
  // 连接池配置
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 创建连接池
const pool = new Pool(dbConfig);

// 连接测试
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// 优雅关闭
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('📊 Database pool has ended');
    process.exit(0);
  });
});

// 数据库查询助手函数
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🔍 Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// 事务助手函数
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// 检查数据库连接
const checkConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection test successful');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('🔢 Database version:', result.rows[0].db_version.split(' ')[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  transaction,
  checkConnection
}; 