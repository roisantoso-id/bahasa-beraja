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
        chinese: '🚀 Belajar Bahasa 2.0 功能大升级！',
        indonesian: '🚀 Upgrade Fitur Besar Belajar Bahasa 2.0!'
      },
      subtitle: {
        chinese: '全新功能上线，让印尼语学习更智能、更高效、更有趣！',
        indonesian: 'Fitur-fitur baru telah diluncurkan, membuat pembelajaran bahasa Indonesia lebih cerdas, efisien, dan menyenangkan!'
      },
      updates: [
        {
          icon: '🧠',
          title: {
            chinese: '智能学习系统',
            indonesian: 'Sistem Pembelajaran Cerdas'
          },
          description: {
            chinese: '新增智能过滤模式，自动跳过已掌握词汇，专注学习新内容，大幅提升学习效率',
            indonesian: 'Menambahkan mode filter cerdas, otomatis melewati kosakata yang dikuasai, fokus belajar konten baru, meningkatkan efisiensi belajar secara signifikan'
          }
        },
        {
          icon: '📚',
          title: {
            chinese: '词汇库大扩容',
            indonesian: 'Ekspansi Besar Kosakata'
          },
          description: {
            chinese: '词汇量从25个激增至80个，新增动物、身体部位、时间等3大分类，学习内容更丰富全面',
            indonesian: 'Kosakata meningkat drastis dari 25 menjadi 80, menambah 3 kategori besar: hewan, bagian tubuh, waktu, konten pembelajaran lebih kaya dan komprehensif'
          }
        },
        {
          icon: '🔊',
          title: {
            chinese: '语音技术优化',
            indonesian: 'Optimasi Teknologi Suara'
          },
          description: {
            chinese: '全面优化语音合成引擎，特别针对Android设备进行适配，发音更准确流畅',
            indonesian: 'Mengoptimalkan mesin sintesis suara secara menyeluruh, khusus adaptasi untuk perangkat Android, pengucapan lebih akurat dan lancar'
          }
        },
        {
          icon: '🎯',
          title: {
            chinese: '学习进度跟踪',
            indonesian: 'Pelacakan Progres Belajar'
          },
          description: {
            chinese: '新增掌握程度标记系统，实时记录学习状态，个性化调整学习路径',
            indonesian: 'Menambahkan sistem penanda tingkat penguasaan, merekam status belajar secara real-time, menyesuaikan jalur pembelajaran secara personal'
          }
        },
        {
          icon: '📊',
          title: {
            chinese: '智能测验升级',
            indonesian: 'Upgrade Kuis Cerdas'
          },
          description: {
            chinese: '测验系统支持多难度选择，根据掌握程度自动生成题目，测试更精准有效',
            indonesian: 'Sistem kuis mendukung pilihan multi-tingkat kesulitan, otomatis menghasilkan soal berdasarkan tingkat penguasaan, pengujian lebih tepat dan efektif'
          }
        },
        {
          icon: '🎨',
          title: {
            chinese: '记忆增强技术',
            indonesian: 'Teknologi Peningkatan Memori'
          },
          description: {
            chinese: '为每个词汇配备专属emoji图标，运用视觉记忆法，显著提升记忆效果和学习趣味性',
            indonesian: 'Melengkapi setiap kosakata dengan ikon emoji khusus, menggunakan metode memori visual, secara signifikan meningkatkan efek memori dan kesenangan belajar'
          }
        }
      ],
      footer: {
        chinese: '体验全新功能，开启高效印尼语学习之旅！',
        indonesian: 'Rasakan fitur-fitur baru, mulai perjalanan pembelajaran bahasa Indonesia yang efisien!'
      }
    };
  }
}

export default UpdateManager; 