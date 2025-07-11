import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '3306'),
  username: process.env['DB_USER'] || 'pimi_user',
  password: process.env['DB_PASSWORD'] || 'pimi_pass_2024',
  database: process.env['DB_NAME'] || 'pimi_bahasa',
  logging: process.env['NODE_ENV'] === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// 测试数据库连接
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    throw error;
  }
};

export default sequelize; 