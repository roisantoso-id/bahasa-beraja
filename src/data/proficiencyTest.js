// 印尼语能力测试题库
export const proficiencyTestQuestions = [
  {
    id: 1,
    question: "Apa kabar?",
    options: [
      { text: "How are you?", correct: true },
      { text: "What is your name?", correct: false },
      { text: "Where are you from?", correct: false },
      { text: "How old are you?", correct: false }
    ],
    difficulty: "beginner"
  },
  {
    id: 2,
    question: "Saya dari Indonesia",
    options: [
      { text: "I am from Indonesia", correct: true },
      { text: "I am Indonesian", correct: false },
      { text: "I live in Indonesia", correct: false },
      { text: "I love Indonesia", correct: false }
    ],
    difficulty: "beginner"
  },
  {
    id: 3,
    question: "Selamat pagi",
    options: [
      { text: "Good morning", correct: true },
      { text: "Good afternoon", correct: false },
      { text: "Good evening", correct: false },
      { text: "Good night", correct: false }
    ],
    difficulty: "beginner"
  },
  {
    id: 4,
    question: "Terima kasih",
    options: [
      { text: "Thank you", correct: true },
      { text: "You're welcome", correct: false },
      { text: "Please", correct: false },
      { text: "Excuse me", correct: false }
    ],
    difficulty: "beginner"
  },
  {
    id: 5,
    question: "Sampai jumpa",
    options: [
      { text: "Goodbye", correct: true },
      { text: "See you tomorrow", correct: false },
      { text: "See you later", correct: false },
      { text: "Good night", correct: false }
    ],
    difficulty: "beginner"
  },
  // 中级题目
  {
    id: 6,
    question: "Saya sedang belajar bahasa Indonesia",
    options: [
      { text: "I am learning Indonesian", correct: true },
      { text: "I want to learn Indonesian", correct: false },
      { text: "I can speak Indonesian", correct: false },
      { text: "I like Indonesian", correct: false }
    ],
    difficulty: "intermediate"
  },
  {
    id: 7,
    question: "Mari kita pergi ke pasar",
    options: [
      { text: "Let's go to the market", correct: true },
      { text: "I am going to the market", correct: false },
      { text: "The market is far", correct: false },
      { text: "I like the market", correct: false }
    ],
    difficulty: "intermediate"
  },
  {
    id: 8,
    question: "Saya suka makan nasi goreng",
    options: [
      { text: "I like to eat fried rice", correct: true },
      { text: "I want to eat fried rice", correct: false },
      { text: "I am eating fried rice", correct: false },
      { text: "I ate fried rice", correct: false }
    ],
    difficulty: "intermediate"
  },
  {
    id: 9,
    question: "Berapa harga buku ini?",
    options: [
      { text: "How much is this book?", correct: true },
      { text: "Where is the book?", correct: false },
      { text: "What book is this?", correct: false },
      { text: "Is this your book?", correct: false }
    ],
    difficulty: "intermediate"
  },
  {
    id: 10,
    question: "Saya akan pergi ke Jakarta besok",
    options: [
      { text: "I will go to Jakarta tomorrow", correct: true },
      { text: "I went to Jakarta yesterday", correct: false },
      { text: "I am in Jakarta now", correct: false },
      { text: "I have been to Jakarta", correct: false }
    ],
    difficulty: "intermediate"
  },
  // 高级题目
  {
    id: 11,
    question: "Meskipun hujan, saya tetap pergi ke sekolah",
    options: [
      { text: "Although it's raining, I still go to school", correct: true },
      { text: "Because it's raining, I go to school", correct: false },
      { text: "When it rains, I go to school", correct: false },
      { text: "If it rains, I will go to school", correct: false }
    ],
    difficulty: "advanced"
  },
  {
    id: 12,
    question: "Seandainya saya kaya, saya akan membeli rumah besar",
    options: [
      { text: "If I were rich, I would buy a big house", correct: true },
      { text: "When I am rich, I will buy a big house", correct: false },
      { text: "Because I am rich, I bought a big house", correct: false },
      { text: "Although I am rich, I don't want a big house", correct: false }
    ],
    difficulty: "advanced"
  },
  {
    id: 13,
    question: "Dengan demikian, kita bisa menyelesaikan masalah ini",
    options: [
      { text: "Therefore, we can solve this problem", correct: true },
      { text: "However, we can solve this problem", correct: false },
      { text: "Because of that, we can solve this problem", correct: false },
      { text: "In addition, we can solve this problem", correct: false }
    ],
    difficulty: "advanced"
  },
  {
    id: 14,
    question: "Saya akan mengikuti ujian bahasa Indonesia minggu depan",
    options: [
      { text: "I will take the Indonesian language exam next week", correct: true },
      { text: "I took the Indonesian language exam last week", correct: false },
      { text: "I am taking the Indonesian language exam now", correct: false },
      { text: "I have taken the Indonesian language exam", correct: false }
    ],
    difficulty: "advanced"
  },
  {
    id: 15,
    question: "Meskipun sudah larut malam, dia masih bekerja",
    options: [
      { text: "Although it's late at night, he is still working", correct: true },
      { text: "Because it's late at night, he is working", correct: false },
      { text: "When it's late at night, he works", correct: false },
      { text: "If it's late at night, he will work", correct: false }
    ],
    difficulty: "advanced"
  }
];

// 根据分数确定语言水平
export const determineProficiencyLevel = (score) => {
  if (score >= 90) return "advanced";
  if (score >= 70) return "intermediate";
  return "beginner";
};

// 获取测试结果描述
export const getProficiencyDescription = (level) => {
  const descriptions = {
    beginner: {
      title: "初级水平",
      description: "您刚刚开始学习印尼语，建议从基础词汇和简单句型开始学习。",
      recommendation: "建议学习：基础问候语、数字、颜色、简单日常用语等。"
    },
    intermediate: {
      title: "中级水平",
      description: "您已经掌握了印尼语的基础知识，可以开始学习更复杂的语法和表达。",
      recommendation: "建议学习：复合句、时态变化、常用成语、日常对话等。"
    },
    advanced: {
      title: "高级水平",
      description: "您的印尼语水平已经相当不错，可以开始学习更专业的表达和复杂语法。",
      recommendation: "建议学习：专业术语、文学表达、复杂语法结构、印尼文化等。"
    }
  };
  return descriptions[level];
}; 