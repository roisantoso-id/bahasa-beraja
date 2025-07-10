// 蓝紫色商务风格主题配置
export const theme = {
  // 主色调 - 蓝紫色系
  primary: {
    main: '#6366f1',      // 主蓝紫色
    light: '#818cf8',     // 浅蓝紫色
    dark: '#4f46e5',      // 深蓝紫色
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // 主渐变
    gradientLight: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)', // 浅渐变
  },
  
  // 辅助色
  secondary: {
    main: '#8b5cf6',      // 紫色
    light: '#a78bfa',     // 浅紫色
    dark: '#7c3aed',      // 深紫色
  },
  
  // 背景色
  background: {
    main: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', // 主背景渐变
    light: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // 浅背景渐变
    card: 'rgba(255, 255, 255, 0.95)', // 卡片背景
    overlay: 'rgba(255, 255, 255, 0.1)', // 覆盖层背景
  },
  
  // 文字颜色
  text: {
    primary: '#1e293b',   // 主要文字
    secondary: '#64748b', // 次要文字
    light: '#94a3b8',     // 浅色文字
    white: '#ffffff',     // 白色文字
    accent: '#6366f1',    // 强调文字
  },
  
  // 状态颜色
  status: {
    success: '#10b981',   // 成功绿
    warning: '#f59e0b',   // 警告橙
    error: '#ef4444',     // 错误红
    info: '#3b82f6',      // 信息蓝
  },
  
  // 边框和阴影
  border: {
    light: 'rgba(99, 102, 241, 0.2)', // 浅色边框
    medium: 'rgba(99, 102, 241, 0.3)', // 中等边框
    dark: 'rgba(99, 102, 241, 0.5)',   // 深色边框
  },
  
  shadow: {
    light: '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
    medium: '0 10px 15px -3px rgba(99, 102, 241, 0.1)',
    dark: '0 20px 25px -5px rgba(99, 102, 241, 0.1)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  // 按钮样式
  button: {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: '#ffffff',
      hover: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#6366f1',
      hover: 'rgba(255, 255, 255, 1)',
    },
    outline: {
      background: 'transparent',
      color: '#6366f1',
      border: '2px solid #6366f1',
      hover: 'rgba(99, 102, 241, 0.1)',
    }
  },
  
  // 卡片样式
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '20px',
  },
  
  // 输入框样式
  input: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    focus: '2px solid #6366f1',
    placeholder: '#94a3b8',
  }
};

// 导出常用的颜色变量
export const colors = {
  primary: theme.primary.main,
  primaryLight: theme.primary.light,
  primaryDark: theme.primary.dark,
  secondary: theme.secondary.main,
  background: theme.background.main,
  text: theme.text.primary,
  textSecondary: theme.text.secondary,
  white: theme.text.white,
  success: theme.status.success,
  warning: theme.status.warning,
  error: theme.status.error,
  info: theme.status.info,
};

// 导出渐变
export const gradients = {
  primary: theme.primary.gradient,
  primaryLight: theme.primary.gradientLight,
  background: theme.background.main,
  backgroundLight: theme.background.light,
};

// 导出阴影
export const shadows = theme.shadow; 