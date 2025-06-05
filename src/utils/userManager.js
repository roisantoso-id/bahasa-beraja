// 用户管理工具类
// 处理用户登录、注册和会话管理

const USER_KEY = 'bahasa_beraja_current_user';
const USERS_KEY = 'bahasa_beraja_users';

class UserManager {
  // 获取当前用户
  static getCurrentUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // 设置当前用户
  static setCurrentUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error setting current user:', error);
      return false;
    }
  }

  // 获取所有用户
  static getAllUsers() {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error getting all users:', error);
      return {};
    }
  }

  // 保存用户数据
  static saveUser(user) {
    try {
      const users = this.getAllUsers();
      users[user.id] = {
        ...user,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  // 用户登录
  static login(username, displayName = '') {
    if (!username || username.trim() === '') {
      return { success: false, message: '用户名不能为空' };
    }

    const userId = username.toLowerCase().trim();
    const users = this.getAllUsers();
    
    let user = users[userId];
    
    if (!user) {
      // 新用户注册
      user = {
        id: userId,
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1
      };
    } else {
      // 现有用户登录
      user = {
        ...user,
        lastLoginAt: new Date().toISOString(),
        loginCount: (user.loginCount || 0) + 1
      };
      
      // 更新显示名称（如果提供了新的）
      if (displayName.trim()) {
        user.displayName = displayName.trim();
      }
    }

    // 保存用户数据
    if (this.saveUser(user)) {
      this.setCurrentUser(user);
      return { success: true, user };
    } else {
      return { success: false, message: '保存用户信息失败' };
    }
  }

  // 用户登出
  static logout() {
    try {
      localStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  // 检查用户是否已登录
  static isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // 删除用户账户
  static deleteUser(userId) {
    try {
      const users = this.getAllUsers();
      if (users[userId]) {
        delete users[userId];
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // 如果删除的是当前用户，则登出
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          this.logout();
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // 更新用户信息
  static updateUser(updates) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;

      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (this.saveUser(updatedUser)) {
        this.setCurrentUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // 获取用户统计信息
  static getUserStats() {
    const users = this.getAllUsers();
    const userCount = Object.keys(users).length;
    const currentUser = this.getCurrentUser();
    
    return {
      totalUsers: userCount,
      currentUser: currentUser,
      isLoggedIn: this.isLoggedIn()
    };
  }

  // 生成用户头像（基于用户名的颜色）
  static getUserAvatarColor(username) {
    if (!username) return '#667eea';
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  // 获取用户头像字母
  static getUserAvatarLetter(username) {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  }

  // 获取用户的语言水平
  static getProficiencyLevel() {
    const currentUser = this.getCurrentUser();
    return currentUser?.proficiencyLevel || null;
  }

  // 获取用户的测试分数
  static getProficiencyScore() {
    const currentUser = this.getCurrentUser();
    return currentUser?.proficiencyScore || null;
  }

  // 检查用户是否已完成能力测试
  static hasCompletedProficiencyTest() {
    const currentUser = this.getCurrentUser();
    return currentUser?.proficiencyLevel !== undefined;
  }

  // 获取用户的学习进度
  static getLearningProgress() {
    const currentUser = this.getCurrentUser();
    return {
      proficiencyLevel: currentUser?.proficiencyLevel || null,
      proficiencyScore: currentUser?.proficiencyScore || null,
      testCompletedAt: currentUser?.testCompletedAt || null,
      lastLoginAt: currentUser?.lastLoginAt || null,
      loginCount: currentUser?.loginCount || 0
    };
  }

  // 更新用户的学习进度
  static updateLearningProgress(progress) {
    return this.updateUser({
      ...progress,
      updatedAt: new Date().toISOString()
    });
  }
}

export default UserManager; 