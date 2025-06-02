export const grammarData = [
  {
    id: 1,
    title: '基本词序 (Word Order)',
    description: '印尼语的基本词序是主谓宾(SVO)，与中文类似。',
    rules: [
      {
        rule: '主语 + 动词 + 宾语',
        example: 'Saya makan nasi.',
        translation: '我吃米饭。',
        breakdown: 'Saya (我) + makan (吃) + nasi (米饭)'
      },
      {
        rule: '形容词通常放在名词后面',
        example: 'Rumah besar',
        translation: '大房子',
        breakdown: 'Rumah (房子) + besar (大的)'
      }
    ],
    exercises: [
      {
        question: '选择正确的词序：_____ minum air.',
        options: ['Saya', 'Air saya', 'Minum saya', 'Saya air'],
        correct: 0,
        explanation: '印尼语采用SVO词序，主语Saya放在句首。'
      },
      {
        question: '"红色的花"用印尼语怎么说？',
        options: ['Bunga merah', 'Merah bunga', 'Bunga yang merah', 'A和C都对'],
        correct: 3,
        explanation: '形容词可以直接跟在名词后，也可以用"yang"连接。'
      }
    ]
  },
  {
    id: 2,
    title: '人称代词 (Personal Pronouns)',
    description: '印尼语的人称代词系统相对简单，没有复杂的格变。',
    rules: [
      {
        rule: '第一人称单数：Saya/Aku (我)',
        example: 'Saya suka musik.',
        translation: '我喜欢音乐。',
        breakdown: 'Saya比Aku更正式'
      },
      {
        rule: '第二人称：Anda/Kamu (你)',
        example: 'Anda dari mana?',
        translation: '你从哪里来？',
        breakdown: 'Anda比Kamu更正式'
      },
      {
        rule: '第三人称：Dia (他/她)',
        example: 'Dia sedang belajar.',
        translation: '他/她在学习。',
        breakdown: 'Dia不区分性别'
      }
    ],
    exercises: [
      {
        question: '在正式场合，"我"应该用哪个词？',
        options: ['Aku', 'Saya', 'Gue', 'Ku'],
        correct: 1,
        explanation: 'Saya是更正式的第一人称代词，适合正式场合使用。'
      },
      {
        question: '"Dia makan nasi"中的"Dia"指的是：',
        options: ['只能指男性', '只能指女性', '可以指男性或女性', '只能指动物'],
        correct: 2,
        explanation: 'Dia不区分性别，可以指代男性或女性。'
      }
    ]
  },
  {
    id: 3,
    title: '动词时态 (Verb Tenses)',
    description: '印尼语的时态主要通过时间副词和助动词来表达。',
    rules: [
      {
        rule: '现在进行时：sedang + 动词',
        example: 'Saya sedang makan.',
        translation: '我正在吃。',
        breakdown: 'sedang表示正在进行'
      },
      {
        rule: '过去时：sudah + 动词',
        example: 'Saya sudah makan.',
        translation: '我已经吃了。',
        breakdown: 'sudah表示已经完成'
      },
      {
        rule: '将来时：akan + 动词',
        example: 'Saya akan makan.',
        translation: '我将要吃。',
        breakdown: 'akan表示将要发生'
      }
    ],
    exercises: [
      {
        question: '"我正在学习"用印尼语怎么说？',
        options: ['Saya belajar', 'Saya sedang belajar', 'Saya sudah belajar', 'Saya akan belajar'],
        correct: 1,
        explanation: 'sedang + 动词表示正在进行的动作。'
      },
      {
        question: '"akan"表示什么时态？',
        options: ['过去时', '现在时', '将来时', '进行时'],
        correct: 2,
        explanation: 'akan用来表示将来时，表示将要发生的动作。'
      }
    ]
  },
  {
    id: 4,
    title: '疑问句 (Questions)',
    description: '印尼语有多种构成疑问句的方法。',
    rules: [
      {
        rule: '一般疑问句：句末加"?"',
        example: 'Anda suka kopi?',
        translation: '你喜欢咖啡吗？',
        breakdown: '语调上升，或加"tidak"变成"Anda suka kopi tidak?"'
      },
      {
        rule: '特殊疑问句：疑问词 + 陈述句',
        example: 'Apa nama Anda?',
        translation: '你的名字是什么？',
        breakdown: 'Apa (什么) + nama Anda (你的名字)'
      },
      {
        rule: '常用疑问词：Apa, Siapa, Di mana, Kapan',
        example: 'Siapa nama Anda?',
        translation: '你叫什么名字？',
        breakdown: 'Siapa (谁), Di mana (哪里), Kapan (什么时候)'
      }
    ],
    exercises: [
      {
        question: '"什么时候"用印尼语怎么说？',
        options: ['Apa', 'Siapa', 'Kapan', 'Di mana'],
        correct: 2,
        explanation: 'Kapan表示"什么时候"，用来询问时间。'
      },
      {
        question: '"你在哪里？"的正确表达是：',
        options: ['Anda apa?', 'Anda siapa?', 'Anda di mana?', 'Anda kapan?'],
        correct: 2,
        explanation: 'Di mana表示"在哪里"，用来询问地点。'
      }
    ]
  },
  {
    id: 5,
    title: '否定句 (Negation)',
    description: '印尼语的否定主要使用"tidak"和"bukan"。',
    rules: [
      {
        rule: 'tidak + 动词/形容词',
        example: 'Saya tidak makan.',
        translation: '我不吃。',
        breakdown: 'tidak用于否定动词和形容词'
      },
      {
        rule: 'bukan + 名词',
        example: 'Ini bukan buku.',
        translation: '这不是书。',
        breakdown: 'bukan用于否定名词'
      },
      {
        rule: 'belum = 还没有',
        example: 'Saya belum makan.',
        translation: '我还没吃。',
        breakdown: 'belum表示还没有发生'
      }
    ],
    exercises: [
      {
        question: '"我不是学生"应该用哪个否定词？',
        options: ['tidak', 'bukan', 'belum', 'jangan'],
        correct: 1,
        explanation: 'bukan用于否定名词，"学生"是名词。'
      },
      {
        question: '"还没有"用印尼语怎么说？',
        options: ['tidak', 'bukan', 'belum', 'sudah tidak'],
        correct: 2,
        explanation: 'belum表示"还没有"，强调动作尚未发生。'
      }
    ]
  }
]; 