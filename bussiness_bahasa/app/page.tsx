"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Briefcase, Trophy, Users, Play, Lock, Star, Globe, Award, TrendingUp, Sparkles } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("courses")

  const courses = [
    {
      id: 1,
      title: "Bahasa Sehari-hari",
      subtitle: "日常印尼语精通课程",
      description: "从零基础到流利对话，掌握印尼日常生活的所有语言场景",
      level: "Pemula",
      levelChinese: "初级",
      lessons: 36,
      duration: "8 minggu",
      durationChinese: "8周",
      price: "¥399",
      originalPrice: "¥599",
      progress: 0,
      icon: <Users className="h-6 w-6" />,
      isPremium: true,
      rating: 4.9,
      students: 2847,
      features: ["真人发音", "情景对话", "文化背景", "实时纠音"],
      batikColor: "from-amber-600 to-orange-700",
      batikBg: "bg-amber-50",
      batikBorder: "border-amber-200",
    },
    {
      id: 2,
      title: "Bahasa Bisnis Profesional",
      subtitle: "商务印尼语专业认证",
      description: "商务谈判、会议主持、邮件写作，成为印尼商务沟通专家",
      level: "Menengah",
      levelChinese: "中级",
      lessons: 48,
      duration: "12 minggu",
      durationChinese: "12周",
      price: "¥799",
      originalPrice: "¥1199",
      progress: 0,
      icon: <Briefcase className="h-6 w-6" />,
      isPremium: true,
      rating: 4.8,
      students: 1653,
      features: ["商务案例", "行业术语", "谈判技巧", "证书认证"],
      batikColor: "from-indigo-600 to-blue-700",
      batikBg: "bg-indigo-50",
      batikBorder: "border-indigo-200",
    },
    {
      id: 3,
      title: "BIPA Sertifikasi",
      subtitle: "BIPA官方考级冲刺",
      description: "针对BIPA A1-C2全级别的专业考试培训和模拟测试",
      level: "Lanjutan",
      levelChinese: "高级",
      lessons: 42,
      duration: "10 minggu",
      durationChinese: "10周",
      price: "¥999",
      originalPrice: "¥1499",
      progress: 0,
      icon: <Trophy className="h-6 w-6" />,
      isPremium: true,
      rating: 4.9,
      students: 987,
      features: ["官方题库", "专家指导", "模拟考试", "通过保障"],
      batikColor: "from-emerald-600 to-teal-700",
      batikBg: "bg-emerald-50",
      batikBorder: "border-emerald-200",
    },
    {
      id: 4,
      title: "Wawancara Kerja",
      subtitle: "求职面试必胜课程",
      description: "印尼企业面试技巧、简历优化、职场礼仪全方位指导",
      level: "Khusus",
      levelChinese: "专项",
      lessons: 24,
      duration: "6 minggu",
      durationChinese: "6周",
      price: "¥599",
      originalPrice: "¥899",
      progress: 0,
      icon: <BookOpen className="h-6 w-6" />,
      isPremium: true,
      rating: 4.7,
      students: 1234,
      features: ["面试模拟", "简历指导", "职场文化", "HR内推"],
      batikColor: "from-purple-600 to-violet-700",
      batikBg: "bg-purple-50",
      batikBorder: "border-purple-200",
    },
  ]

  const tests = [
    {
      id: 1,
      title: "Tes BIPA A1",
      subtitle: "BIPA A1 能力测试",
      description: "官方标准的初级印尼语能力评估测试",
      duration: "90 menit",
      durationChinese: "90分钟",
      questions: 75,
      type: "Tes Kemampuan",
      typeChinese: "能力测试",
      difficulty: "Pemula",
      batikColor: "from-orange-600 to-red-700",
    },
    {
      id: 2,
      title: "Evaluasi Bahasa Bisnis",
      subtitle: "商务印尼语评估",
      description: "专业商务场景语言运用能力综合测试",
      duration: "60 menit",
      durationChinese: "60分钟",
      questions: 50,
      type: "Tes Profesional",
      typeChinese: "专业测试",
      difficulty: "Menengah",
      batikColor: "from-blue-600 to-indigo-700",
    },
    {
      id: 3,
      title: "Simulasi Wawancara",
      subtitle: "面试模拟测试",
      description: "真实面试场景的语言表达和应变能力测试",
      duration: "45 menit",
      durationChinese: "45分钟",
      questions: 30,
      type: "Tes Praktis",
      typeChinese: "实践测试",
      difficulty: "Lanjutan",
      batikColor: "from-teal-600 to-cyan-700",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Siswa Aktif", labelChinese: "活跃学员" },
    { number: "95%", label: "Tingkat Kelulusan", labelChinese: "通过率" },
    { number: "4.9/5", label: "Rating Pengguna", labelChinese: "用户评分" },
    { number: "24/7", label: "Dukungan Online", labelChinese: "在线支持" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Batik Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23B45309' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Cpath d='M30 10 L30 20 M30 40 L30 50 M10 30 L20 30 M40 30 L50 30' stroke='%23B45309' strokeWidth='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header with Batik Border */}
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-amber-600 to-red-600 relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-600 to-red-700 text-white p-3 rounded-xl shadow-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='15' cy='5' r='1'/%3E%3Ccircle cx='5' cy='15' r='1'/%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <Globe className="h-8 w-8 relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
                  PiMiBahasa
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-amber-600" />
                  Professional Indonesian Learning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-amber-700 hover:bg-amber-50">
                Masuk / 登录
              </Button>
              <Button className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 hover:from-amber-700 hover:to-red-800 text-white shadow-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <span className="relative z-10">Coba Gratis / 免费试用</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Batik Elements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Batik Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 to-orange-700"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute top-20 right-20 w-24 h-24 opacity-10">
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-orange-700"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='23' cy='7' r='1'/%3E%3Ccircle cx='7' cy='23' r='1'/%3E%3Ccircle cx='23' cy='23' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-2 border-amber-300 px-6 py-3 text-sm font-medium relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.3'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <span className="relative z-10">🇮🇩 Platform Pembelajaran Bahasa Indonesia Terdepan</span>
            </Badge>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Kuasai{" "}
            <span className="bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent relative">
              Bahasa Indonesia
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-red-600 opacity-30 rounded-full"></div>
            </span>
            <br />
            <span className="text-3xl text-gray-700">dengan Sentuhan Budaya Nusantara</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            从日常对话到商务谈判，从考级认证到求职面试
            <br />
            <span className="text-amber-700 font-semibold">PiMiBahasa</span> 融合传统蜡染艺术，让学习更具印尼文化魅力
          </p>

          {/* Stats with Batik Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-amber-200 shadow-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.3'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent mb-1 relative z-10">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-700 relative z-10">{stat.label}</div>
                  <div className="text-xs text-gray-500 relative z-10">{stat.labelChinese}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 hover:from-amber-700 hover:to-red-800 text-white px-8 py-4 text-lg shadow-xl relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <Play className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Mulai Belajar / 开始学习</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <Trophy className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Tes Kemampuan / 能力测试</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-amber-200 rounded-xl p-2 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='23' cy='7' r='1'/%3E%3Ccircle cx='7' cy='23' r='1'/%3E%3Ccircle cx='23' cy='23' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg py-3 relative z-10"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Kursus / 课程中心
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg py-3 relative z-10"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Tes / 能力测试
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg py-3 relative z-10"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Progres / 学习进度
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className={`hover:shadow-2xl transition-all duration-300 border-2 ${course.batikBorder} hover:border-opacity-60 bg-white/90 backdrop-blur-sm relative overflow-hidden`}
                >
                  {/* Batik Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.4'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M20 5 L20 15 M20 25 L20 35 M5 20 L15 20 M25 20 L35 20' stroke='%23B45309' strokeWidth='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`bg-gradient-to-br ${course.batikColor} p-3 rounded-xl text-white relative overflow-hidden`}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                          />
                          <div className="relative z-10">{course.icon}</div>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{course.subtitle}</p>
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant="secondary"
                              className={`${course.batikBg} text-gray-800 border ${course.batikBorder}`}
                            >
                              {course.level} / {course.levelChinese}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                              <span className="text-sm font-medium">{course.rating}</span>
                              <span className="text-sm text-gray-500">({course.students})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {course.isPremium && <Lock className="h-5 w-5 text-amber-500" />}
                    </div>
                    <CardDescription className="text-base leading-relaxed mt-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {course.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={`text-xs ${course.batikBorder} text-gray-700 bg-white/80`}
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div
                        className={`flex justify-between text-sm text-gray-600 ${course.batikBg} p-3 rounded-lg border ${course.batikBorder} relative overflow-hidden`}
                      >
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B45309' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                        <span className="relative z-10">{course.lessons} pelajaran / 课时</span>
                        <span className="relative z-10">
                          {course.duration} / {course.durationChinese}
                        </span>
                      </div>

                      <Progress value={course.progress} className="w-full h-2" />

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-2xl font-bold bg-gradient-to-r ${course.batikColor} bg-clip-text text-transparent`}
                          >
                            {course.price}
                          </span>
                          <span className="text-lg text-gray-400 line-through">{course.originalPrice}</span>
                        </div>
                        <Button
                          className={`bg-gradient-to-r ${course.batikColor} hover:opacity-90 text-white shadow-lg relative overflow-hidden`}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                          />
                          <Play className="h-4 w-4 mr-2 relative z-10" />
                          <span className="relative z-10">Mulai / 开始</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card
                  key={test.id}
                  className="hover:shadow-xl transition-all duration-300 border-2 border-orange-200 hover:border-orange-300 bg-white/90 backdrop-blur-sm relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 35 35' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EA580C' fillOpacity='0.4'%3E%3Ccircle cx='17.5' cy='17.5' r='2'/%3E%3Ccircle cx='8' cy='8' r='1'/%3E%3Ccircle cx='27' cy='8' r='1'/%3E%3Ccircle cx='8' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`bg-gradient-to-br ${test.batikColor} p-3 rounded-xl text-white relative overflow-hidden`}
                      >
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                        <Trophy className="h-6 w-6 relative z-10" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <p className="text-sm text-gray-600">{test.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                        {test.type} / {test.typeChinese}
                      </Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {test.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="leading-relaxed">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="bg-orange-50 p-3 rounded-lg space-y-2 border border-orange-200 relative overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EA580C' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                        <div className="flex justify-between text-sm relative z-10">
                          <span>Durasi / 时长:</span>
                          <span className="font-medium">
                            {test.duration} / {test.durationChinese}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm relative z-10">
                          <span>Soal / 题目:</span>
                          <span className="font-medium">{test.questions} pertanyaan</span>
                        </div>
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${test.batikColor} hover:opacity-90 text-white relative overflow-hidden`}
                      >
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                        <span className="relative z-10">Mulai Tes / 开始测试</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-blue-200 bg-white/90 backdrop-blur-sm relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563EB' fillOpacity='0.4'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  <CardTitle className="flex items-center space-x-2 relative z-10">
                    <TrendingUp className="h-5 w-5" />
                    <span>Statistik Belajar / 学习统计</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563EB' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <span className="relative z-10">Total Waktu Belajar / 总学习时长</span>
                      <span className="font-bold text-blue-600 relative z-10">0 jam</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316A34A' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <span className="relative z-10">Kursus Selesai / 完成课程</span>
                      <span className="font-bold text-green-600 relative z-10">0 / 4</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23EA580C' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <span className="relative z-10">Tes Lulus / 测试通过</span>
                      <span className="font-bold text-orange-600 relative z-10">0 / 3</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237C3AED' fillOpacity='0.3'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <span className="relative z-10">Kosakata Dikuasai / 掌握词汇</span>
                      <span className="font-bold text-purple-600 relative z-10">0 kata</span>
                    </div>
                  </div>
                  <Progress value={0} className="w-full h-3" />
                  <p className="text-center text-sm text-gray-600">
                    Mulai perjalanan belajar Anda! / 开始您的学习之旅！
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-white/90 backdrop-blur-sm relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fillOpacity='0.4'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='30' cy='10' r='2'/%3E%3Ccircle cx='10' cy='30' r='2'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-t-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  <CardTitle className="flex items-center space-x-2 relative z-10">
                    <Award className="h-5 w-5" />
                    <span>Pencapaian / 最近成就</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-center py-12 text-gray-500">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F59E0B' fillOpacity='0.4'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='23' cy='7' r='1'/%3E%3Ccircle cx='7' cy='23' r='1'/%3E%3Ccircle cx='23' cy='23' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <Trophy className="h-12 w-12 text-amber-600 relative z-10" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Selamat Datang! / 欢迎加入！</h3>
                    <p className="text-sm">Mulai belajar untuk mendapatkan pencapaian pertama Anda!</p>
                    <p className="text-xs text-gray-400 mt-1">开始学习获得您的第一个成就！</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Section with Batik Style */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3Ccircle cx='45' cy='15' r='2'/%3E%3Ccircle cx='15' cy='45' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3Cpath d='M30 10 L30 20 M30 40 L30 50 M10 30 L20 30 M40 30 L50 30' stroke='white' strokeWidth='1' strokeOpacity='0.2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Mengapa Memilih PiMiBahasa?</h3>
            <p className="text-xl opacity-90">为什么选择融合蜡染文化的专业印尼语学习平台？</p>
            <div className="w-24 h-1 bg-white/30 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <BookOpen className="h-10 w-10 relative z-10" />
              </div>
              <h4 className="text-xl font-bold mb-3">Kurikulum Berbudaya</h4>
              <p className="text-sm opacity-90 mb-2">融合文化的专业课程体系</p>
              <p className="opacity-80 leading-relaxed">
                Pembelajaran yang memadukan tradisi batik dengan metode modern
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <Trophy className="h-10 w-10 relative z-10" />
              </div>
              <h4 className="text-xl font-bold mb-3">Sertifikasi Autentik</h4>
              <p className="text-sm opacity-90 mb-2">地道的权威考级认证</p>
              <p className="opacity-80 leading-relaxed">
                Sertifikat yang diakui dengan sentuhan kearifan lokal Indonesia
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='12.5' cy='12.5' r='2'/%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3Ccircle cx='19' cy='6' r='1'/%3E%3Ccircle cx='6' cy='19' r='1'/%3E%3Ccircle cx='19' cy='19' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <Briefcase className="h-10 w-10 relative z-10" />
              </div>
              <h4 className="text-xl font-bold mb-3">Karir Nusantara</h4>
              <p className="text-sm opacity-90 mb-2">印尼本土求职面试指导</p>
              <p className="opacity-80 leading-relaxed">
                Panduan karir dengan pemahaman mendalam budaya kerja Indonesia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Batik Elements */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.3'%3E%3Ccircle cx='25' cy='25' r='3'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='38' cy='12' r='2'/%3E%3Ccircle cx='12' cy='38' r='2'/%3E%3Ccircle cx='38' cy='38' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-amber-600 to-red-700 text-white p-2 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fillOpacity='0.4'%3E%3Ccircle cx='7.5' cy='7.5' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                  <Globe className="h-6 w-6 relative z-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">PiMiBahasa</h3>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                    Professional Indonesian Learning with Batik Touch
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Platform pembelajaran Bahasa Indonesia terdepan yang memadukan tradisi batik nusantara dengan teknologi
                modern, memberikan pengalaman belajar yang autentik dan berbudaya.
              </p>
              <p className="text-sm text-gray-400">融合传统蜡染艺术的专业印尼语学习平台，让学习更具文化魅力</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Kursus / 课程</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Bahasa Sehari-hari</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Bahasa Bisnis</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Persiapan BIPA</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Wawancara Kerja</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Dukungan / 支持</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Pusat Bantuan</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Hubungi Kami</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer">Komunitas</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-30 rounded-full mb-4"></div>
            <p className="text-sm text-gray-400">
              &copy; 2024 PiMiBahasa. Semua hak dilindungi. Dibuat dengan ❤️ dan sentuhan budaya Indonesia / 版权所有
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
