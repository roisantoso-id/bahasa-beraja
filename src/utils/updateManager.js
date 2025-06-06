class UpdateManager {
  static CURRENT_VERSION = '2.0.0';
  static VERSION_KEY = 'app_version';
  static SHOW_UPDATE_KEY = 'show_update_modal';

  // 获取当前存储的版本
  static getCurrentStoredVersion() {
    return localStorage.getItem(this.VERSION_KEY) || '1.0.0';
  }

  // 设置当前版本
  static setCurrentVersion() {
    localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
  }

  // 检查是否需要显示更新弹窗
  static shouldShowUpdateModal() {
    const storedVersion = this.getCurrentStoredVersion();
    const showUpdate = localStorage.getItem(this.SHOW_UPDATE_KEY);
    
    // 如果版本不同且还没有显示过更新弹窗
    return storedVersion !== this.CURRENT_VERSION && showUpdate !== 'false';
  }

  // 标记更新弹窗已显示
  static markUpdateModalShown() {
    localStorage.setItem(this.SHOW_UPDATE_KEY, 'false');
    this.setCurrentVersion();
  }

  // 重置更新状态（用于测试）
  static resetUpdateStatus() {
    localStorage.removeItem(this.VERSION_KEY);
    localStorage.removeItem(this.SHOW_UPDATE_KEY);
  }

  // 获取更新内容
  static getUpdateContent() {
    return {
      version: this.CURRENT_VERSION,
      title: {
        chinese: '🎉 Belajar Bahasa 2.0 重大更新！',
        indonesian: '🎉 Pembaruan Besar Belajar Bahasa 2.0!'
      },
      subtitle: {
        chinese: '感谢您的耐心等待，我们为您带来了令人兴奋的新功能和改进！',
        indonesian: 'Terima kasih atas kesabaran Anda, kami membawa fitur dan perbaikan baru yang menarik!'
      },
      updates: [
        {
          icon: '🔧',
          title: {
            chinese: '界面优化',
            indonesian: 'Optimasi Antarmuka'
          },
          description: {
            chinese: '修复测验页面按钮位置问题，优化用户体验',
            indonesian: 'Memperbaiki posisi tombol halaman kuis, mengoptimalkan pengalaman pengguna'
          }
        },
        {
          icon: '📚',
          title: {
            chinese: '词汇库扩展',
            indonesian: 'Ekspansi Kosakata'
          },
          description: {
            chinese: '从25个扩展到80个词汇，新增动物、身体部位、时间等分类',
            indonesian: 'Diperluas dari 25 menjadi 80 kosakata, menambah kategori hewan, bagian tubuh, waktu, dll'
          }
        },
        {
          icon: '🎯',
          title: {
            chinese: '应用名称更新',
            indonesian: 'Pembaruan Nama Aplikasi'
          },
          description: {
            chinese: '应用名称正式更新为"Belajar Bahasa"',
            indonesian: 'Nama aplikasi resmi diperbarui menjadi "Belajar Bahasa"'
          }
        },
        {
          icon: '🔊',
          title: {
            chinese: '语音功能增强',
            indonesian: 'Peningkatan Fitur Suara'
          },
          description: {
            chinese: '改进Android设备语音合成，发音更加清晰准确',
            indonesian: 'Meningkatkan sintesis suara perangkat Android, pengucapan lebih jelas dan akurat'
          }
        },
        {
          icon: '🧠',
          title: {
            chinese: '智能学习模式',
            indonesian: 'Mode Pembelajaran Cerdas'
          },
          description: {
            chinese: '新增智能过滤功能，自动跳过已掌握词汇，提高学习效率',
            indonesian: 'Menambah fitur filter cerdas, otomatis melewati kosakata yang dikuasai, meningkatkan efisiensi belajar'
          }
        },
        {
          icon: '🎨',
          title: {
            chinese: '视觉升级',
            indonesian: 'Peningkatan Visual'
          },
          description: {
            chinese: '为所有词汇卡片添加精美emoji图标，增强记忆效果',
            indonesian: 'Menambahkan ikon emoji indah untuk semua kartu kosakata, meningkatkan efek memori'
          }
        }
      ],
      footer: {
        chinese: '立即体验这些激动人心的新功能吧！',
        indonesian: 'Nikmati fitur-fitur baru yang menarik ini sekarang juga!'
      }
    };
  }
}

export default UpdateManager; 