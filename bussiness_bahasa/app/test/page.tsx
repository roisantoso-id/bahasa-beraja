"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, Trophy, Star, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(5400) // 90 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false)

  const testInfo = {
    title: "Tes BIPA A1",
    subtitle: "BIPA A1 能力测试",
    description: "Tes kemampuan bahasa Indonesia tingkat pemula sesuai standar BIPA",
    duration: "90 menit",
    totalQuestions: 75,
    passingScore: 70,
  }

  const questions = [
    {
      id: 0,
      question: '"Selamat pagi" dalam bahasa Mandarin artinya?',
      questionChinese: '"Selamat pagi" 在中文中的意思是？',
      options: [
        { value: "a", label: "晚上好" },
        { value: "b", label: "早上好" },
        { value: "c", label: "下午好" },
        { value: "d", label: "晚安" },
      ],
      correct: "b",
      explanation: "Selamat pagi = 早上好 (zǎo shàng hǎo)",
    },
    {
      id: 1,
      question: 'Apa arti dari "Terima kasih" dalam bahasa Mandarin?',
      questionChinese: '印尼语中 "Terima kasih" 表示什么意思？',
      options: [
        { value: "a", label: "对不起" },
        { value: "b", label: "不客气" },
        { value: "c", label: "谢谢" },
        { value: "d", label: "再见" },
      ],
      correct: "c",
      explanation: "Terima kasih = 谢谢 (xiè xiè)",
    },
    {
      id: 2,
      question: 'Dalam situasi bisnis, bagaimana cara mengatakan "很高兴见到您" dalam bahasa Indonesia?',
      questionChinese: '在商务场合，如何用印尼语说"很高兴见到您"？',
      options: [
        { value: "a", label: "Senang bertemu dengan Anda" },
        { value: "b", label: "Sampai jumpa lagi" },
        { value: "c", label: "Permisi" },
        { value: "d", label: "Maaf" },
      ],
      correct: "a",
      explanation: "Senang bertemu dengan Anda = 很高兴见到您",
    },
    {
      id: 3,
      question: 'Apa arti kalimat "Saya bekerja di kantor" dalam bahasa Mandarin?',
      questionChinese: '"Saya bekerja di kantor" 的中文意思是？',
      options: [
        { value: "a", label: "我在家工作" },
        { value: "b", label: "我在办公室工作" },
        { value: "c", label: "我在学校工作" },
        { value: "d", label: "我在医院工作" },
      ],
      correct: "b",
      explanation: "Saya bekerja di kantor = 我在办公室工作",
    },
    {
      id: 4,
      question: 'Angka "lima" dalam bahasa Indonesia sama dengan angka berapa?',
      questionChinese: '印尼语数字 "lima" 对应的阿拉伯数字是？',
      options: [
        { value: "a", label: "3" },
        { value: "b", label: "4" },
        { value: "c", label: "5" },
        { value: "d", label: "6" },
      ],
      correct: "c",
      explanation: "Lima = 5 (五)",
    },
  ]

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsCompleted(true)
    }
  }, [timeLeft, isCompleted])

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    setIsCompleted(true)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90)
      return { level: "Luar Biasa", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
    if (score >= 80)
      return { level: "Sangat Baik", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
    if (score >= 70) return { level: "Baik", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" }
    return { level: "Perlu Perbaikan", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  if (isCompleted) {
    const score = calculateScore()
    const scoreLevel = getScoreLevel(score)
    const correctAnswers = questions.filter((_, index) => answers[index] === questions[index].correct).length
    const isPassed = score >= testInfo.passingScore

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl border-2 border-red-100">
          <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="mx-auto mb-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {isPassed ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : (
                <AlertCircle className="h-10 w-10 text-white" />
              )}
            </div>
            <CardTitle className="text-3xl mb-2">{isPassed ? "Selamat! Tes Selesai!" : "Tes Selesai"}</CardTitle>
            <CardDescription className="text-red-100 text-lg">
              {isPassed ? "恭喜您通过了BIPA A1测试！" : "感谢您完成测试"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Score Display */}
              <div className="text-center">
                <div className="text-6xl font-bold text-red-600 mb-4">{score}</div>
                <div className={`inline-block px-6 py-3 rounded-full ${scoreLevel.bg} ${scoreLevel.border} border-2`}>
                  <p className={`${scoreLevel.color} font-bold text-lg`}>{scoreLevel.level}</p>
                </div>
                <p className="text-gray-600 mt-4 text-lg">
                  Anda menjawab benar {correctAnswers} dari {questions.length} soal
                </p>
                <p className="text-gray-500">
                  您答对了 {correctAnswers} / {questions.length} 题
                </p>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5" />
                      <span>Analisis Hasil / 结果分析</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {isPassed ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-800 font-medium">
                            Luar biasa! Kemampuan bahasa Indonesia Anda sudah mencapai level A1 BIPA.
                          </p>
                          <p className="text-green-700 text-sm mt-1">优秀！您的印尼语水平已达到BIPA A1级别。</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-orange-800 font-medium">
                            Terus berlatih! Anda hampir mencapai level A1 BIPA.
                          </p>
                          <p className="text-orange-700 text-sm mt-1">继续努力！您即将达到BIPA A1水平。</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Skor Minimum:</span>
                          <span className="font-medium">{testInfo.passingScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Skor Anda:</span>
                          <span className={`font-bold ${isPassed ? "text-green-600" : "text-orange-600"}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className={isPassed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                            {isPassed ? "LULUS / 通过" : "BELUM LULUS / 未通过"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span>Rekomendasi / 推荐</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {isPassed ? (
                        <>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-bold text-blue-900 mb-2">Lanjutkan ke Level Berikutnya</h4>
                            <p className="text-blue-800 text-sm">Ambil kursus BIPA A2 atau Bahasa Bisnis Profesional</p>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-bold text-green-900 mb-2">Dapatkan Sertifikat</h4>
                            <p className="text-green-800 text-sm">
                              Unduh sertifikat resmi PiMiBahasa untuk portofolio Anda
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-bold text-yellow-900 mb-2">Perkuat Dasar</h4>
                            <p className="text-yellow-800 text-sm">
                              Ikuti kursus "Bahasa Sehari-hari" untuk memperkuat fondasi
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-bold text-blue-900 mb-2">Latihan Tambahan</h4>
                            <p className="text-blue-800 text-sm">Gunakan fitur latihan harian dan review kosakata</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3"
                  asChild
                >
                  <Link href="/">Kembali ke Beranda / 返回首页</Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 py-3 bg-transparent"
                >
                  Lihat Pembahasan / 查看详细解析
                </Button>
                {isPassed && (
                  <Button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3">
                    Unduh Sertifikat / 下载证书
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-700">Sisa Waktu: {formatTime(timeLeft)}</span>
              </div>
              <Badge className="bg-red-100 text-red-800">
                {currentQuestion + 1} / {questions.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-2 border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{testInfo.title}</CardTitle>
                    <p className="text-red-100">{testInfo.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Soal / 题目</div>
                    <div className="text-2xl font-bold">{currentQuestion + 1}</div>
                  </div>
                </div>
                <Progress
                  value={((currentQuestion + 1) / questions.length) * 100}
                  className="w-full mt-4 bg-red-800/30"
                />
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{questions[currentQuestion].question}</h2>
                  <p className="text-lg text-gray-600 mb-6">{questions[currentQuestion].questionChinese}</p>

                  <RadioGroup
                    value={answers[currentQuestion] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-4"
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="text-red-600" />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-lg">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Sebelumnya / 上一题
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8"
                    >
                      Kirim Jawaban / 提交答案
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      Selanjutnya / 下一题
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle>Progres Tes / 答题进度</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={index === currentQuestion ? "default" : answers[index] ? "secondary" : "outline"}
                      size="sm"
                      className={`w-10 h-10 p-0 ${
                        index === currentQuestion
                          ? "bg-red-600 hover:bg-red-700"
                          : answers[index]
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sudah Dijawab:</span>
                    <span className="font-bold text-green-600">
                      {Object.keys(answers).length} / {questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Belum Dijawab:</span>
                    <span className="font-bold text-orange-600">{questions.length - Object.keys(answers).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-100">
              <CardHeader className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-t-lg">
                <CardTitle>Informasi Tes / 考试说明</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm space-y-3">
                <div className="flex justify-between">
                  <span>Total Soal:</span>
                  <span className="font-medium">{testInfo.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Tes:</span>
                  <span className="font-medium">{testInfo.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nilai Lulus:</span>
                  <span className="font-medium">{testInfo.passingScore}%</span>
                </div>
                <div className="pt-3 border-t border-yellow-200 space-y-1 text-xs text-gray-600">
                  <p>• Setiap soal bernilai sama</p>
                  <p>• Dapat kembali mengubah jawaban</p>
                  <p>• Setelah submit tidak dapat diubah</p>
                  <p>• 每题分值相同</p>
                  <p>• 可以返回修改答案</p>
                  <p>• 提交后不可修改</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle>Tips Sukses / 成功秘诀</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm space-y-2 text-gray-700">
                <p>• Baca soal dengan teliti</p>
                <p>• Manfaatkan waktu dengan baik</p>
                <p>• Jawab yang mudah terlebih dahulu</p>
                <p>• Periksa kembali sebelum submit</p>
                <div className="pt-2 border-t border-green-200 text-xs text-gray-600">
                  <p>仔细阅读题目，合理分配时间</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
