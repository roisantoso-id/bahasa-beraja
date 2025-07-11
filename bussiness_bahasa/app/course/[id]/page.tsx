"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  Volume2,
  FileText,
  Star,
  Users,
  Clock,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function CoursePage() {
  const [currentLesson, setCurrentLesson] = useState(1)

  const courseData = {
    title: "Bahasa Sehari-hari",
    subtitle: "日常印尼语精通课程",
    description: "从零基础到流利对话，掌握印尼日常生活的所有语言场景",
    level: "Pemula / 初级",
    progress: 35,
    totalLessons: 36,
    rating: 4.9,
    students: 2847,
    instructor: "Dr. Sari Wijaya",
    duration: "8 minggu",
  }

  const lessons = [
    {
      id: 1,
      title: "Salam dan Perkenalan",
      titleChinese: "问候与自我介绍",
      description: "Belajar cara menyapa dan memperkenalkan diri dalam bahasa Indonesia",
      duration: "18 menit",
      type: "Video + Latihan",
      completed: true,
      locked: false,
      vocabulary: 12,
    },
    {
      id: 2,
      title: "Angka dan Waktu",
      titleChinese: "数字与时间",
      description: "Menguasai penggunaan angka dan ekspresi waktu dalam kehidupan sehari-hari",
      duration: "22 menit",
      type: "Interaktif",
      completed: true,
      locked: false,
      vocabulary: 15,
    },
    {
      id: 3,
      title: "Keluarga dan Hubungan",
      titleChinese: "家庭与关系",
      description: "Mempelajari sebutan anggota keluarga dan hubungan sosial",
      duration: "20 menit",
      type: "Video + Audio",
      completed: false,
      locked: false,
      vocabulary: 18,
    },
    {
      id: 4,
      title: "Berbelanja di Pasar",
      titleChinese: "市场购物",
      description: "Percakapan praktis saat berbelanja dan tawar-menawar",
      duration: "25 menit",
      type: "Simulasi",
      completed: false,
      locked: true,
      vocabulary: 20,
    },
    {
      id: 5,
      title: "Makan di Restoran",
      titleChinese: "餐厅用餐",
      description: "Cara memesan makanan dan berkomunikasi di restoran",
      duration: "23 menit",
      type: "Role Play",
      completed: false,
      locked: true,
      vocabulary: 16,
    },
  ]

  const vocabulary = [
    {
      indonesian: "Selamat pagi",
      chinese: "早上好",
      pronunciation: "se-la-mat pa-gi",
      example: "Selamat pagi, Pak! Apa kabar?",
      exampleChinese: "早上好，先生！您好吗？",
    },
    {
      indonesian: "Terima kasih",
      chinese: "谢谢",
      pronunciation: "te-ri-ma ka-sih",
      example: "Terima kasih atas bantuannya.",
      exampleChinese: "谢谢您的帮助。",
    },
    {
      indonesian: "Permisi",
      chinese: "不好意思/打扰一下",
      pronunciation: "per-mi-si",
      example: "Permisi, boleh saya lewat?",
      exampleChinese: "不好意思，我可以过去吗？",
    },
    {
      indonesian: "Maaf",
      chinese: "对不起",
      pronunciation: "ma-af",
      example: "Maaf, saya terlambat.",
      exampleChinese: "对不起，我迟到了。",
    },
    {
      indonesian: "Sampai jumpa",
      chinese: "再见",
      pronunciation: "sam-pai jum-pa",
      example: "Sampai jumpa besok!",
      exampleChinese: "明天见！",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali / 返回首页
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">Progress: {courseData.progress}%</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <Card className="mb-8 border-2 border-red-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{courseData.title}</CardTitle>
                    <p className="text-red-100 mb-3">{courseData.subtitle}</p>
                    <CardDescription className="text-red-50 text-base leading-relaxed">
                      {courseData.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {courseData.level}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{courseData.rating}</span>
                    </div>
                    <p className="text-xs text-red-100">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="font-bold">{courseData.students.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-red-100">Siswa</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-bold">{courseData.duration}</span>
                    </div>
                    <p className="text-xs text-red-100">Durasi</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Award className="h-4 w-4" />
                      <span className="font-bold">Sertifikat</span>
                    </div>
                    <p className="text-xs text-red-100">Certificate</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progres Kursus / 课程进度</span>
                    <span className="font-semibold">{courseData.progress}%</span>
                  </div>
                  <Progress value={courseData.progress} className="w-full h-3" />
                  <p className="text-sm text-gray-600">
                    {Math.round((courseData.progress / 100) * courseData.totalLessons)} dari {courseData.totalLessons}{" "}
                    pelajaran selesai
                  </p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg border-2 border-red-100 rounded-xl p-2">
                <TabsTrigger
                  value="lessons"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg"
                >
                  Pelajaran / 课程内容
                </TabsTrigger>
                <TabsTrigger
                  value="vocabulary"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg"
                >
                  Kosakata / 词汇表
                </TabsTrigger>
                <TabsTrigger
                  value="exercises"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white rounded-lg"
                >
                  Latihan / 练习题
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lessons" className="space-y-4 mt-6">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                      currentLesson === lesson.id
                        ? "ring-2 ring-red-500 border-red-200 shadow-lg"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            {lesson.completed ? (
                              <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              </div>
                            ) : lesson.locked ? (
                              <div className="bg-gray-100 p-2 rounded-full">
                                <Lock className="h-6 w-6 text-gray-400" />
                              </div>
                            ) : (
                              <div className="bg-red-100 p-2 rounded-full">
                                <Play className="h-6 w-6 text-red-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{lesson.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{lesson.titleChinese}</p>
                            <p className="text-gray-700 mb-3 leading-relaxed">{lesson.description}</p>
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className="border-red-200 text-red-700">
                                {lesson.type}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.duration}
                              </span>
                              <span className="text-sm text-gray-500">{lesson.vocabulary} kosakata</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={lesson.locked ? "secondary" : "default"}
                          disabled={lesson.locked}
                          onClick={() => setCurrentLesson(lesson.id)}
                          className={
                            lesson.locked
                              ? ""
                              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                          }
                        >
                          {lesson.completed ? "Ulangi / 复习" : lesson.locked ? "Terkunci / 锁定" : "Mulai / 开始"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="vocabulary" className="space-y-6 mt-6">
                <Card className="border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle>Kosakata Pelajaran / 本课词汇</CardTitle>
                    <CardDescription className="text-blue-100">
                      Klik tombol suara untuk mendengar pelafalan yang benar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {vocabulary.map((word, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="font-bold text-xl text-blue-900">{word.indonesian}</div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-300 text-blue-700 hover:bg-blue-200 bg-transparent"
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-gray-700 font-medium mb-1">{word.chinese}</div>
                              <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Pelafalan:</span> {word.pronunciation}
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-900 mb-1">{word.example}</p>
                                <p className="text-sm text-gray-600">{word.exampleChinese}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercises" className="space-y-6 mt-6">
                <Card className="border-2 border-green-100">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                    <CardTitle>Latihan Soal / 练习题</CardTitle>
                    <CardDescription className="text-green-100">
                      Selesaikan latihan untuk memperkuat pemahaman Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="p-6 border-2 border-green-200 rounded-xl bg-green-50">
                        <h4 className="font-bold text-lg mb-4 text-green-900">
                          Soal 1: "早上好" dalam bahasa Indonesia adalah?
                        </h4>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-white hover:bg-green-100 border-green-300"
                          >
                            A. Selamat siang
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-white hover:bg-green-100 border-green-300"
                          >
                            B. Selamat pagi ✓
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-white hover:bg-green-100 border-green-300"
                          >
                            C. Selamat malam
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-white hover:bg-green-100 border-green-300"
                          >
                            D. Selamat sore
                          </Button>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3">
                        Kirim Jawaban / 提交答案
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle>Progres Belajar / 学习进度</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <span>Pelajaran Selesai</span>
                    <span className="font-bold text-purple-600">12 / 36</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <span>Waktu Belajar</span>
                    <span className="font-bold text-blue-600">4.5 jam</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span>Kosakata Dikuasai</span>
                    <span className="font-bold text-green-600">89 kata</span>
                  </div>
                  <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                    <span>Skor Rata-rata</span>
                    <span className="font-bold text-orange-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-t-lg">
                <CardTitle>Pengingat Belajar / 学习提醒</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-sm">Target Harian</p>
                      <p className="text-xs text-gray-600">30 menit per hari</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm">Review Mingguan</p>
                      <p className="text-xs text-gray-600">15 kosakata baru</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white">
                    Atur Pengingat / 设置提醒
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                <CardTitle>Kursus Terkait / 相关课程</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 border-2 border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm text-indigo-900 mb-1">Bahasa Bisnis Profesional</h4>
                    <p className="text-xs text-indigo-700">Tingkatkan kemampuan komunikasi bisnis</p>
                    <Badge className="mt-2 bg-indigo-200 text-indigo-800 text-xs">Menengah</Badge>
                  </div>
                  <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <h4 className="font-bold text-sm text-green-900 mb-1">Persiapan BIPA</h4>
                    <p className="text-xs text-green-700">Latihan khusus ujian BIPA</p>
                    <Badge className="mt-2 bg-green-200 text-green-800 text-xs">Lanjutan</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
