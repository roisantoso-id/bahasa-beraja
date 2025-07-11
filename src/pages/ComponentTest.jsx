import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BookOpen, Globe, Trophy, Users, Sparkles } from 'lucide-react';

const ComponentTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      {/* 页面标题 */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
          组件测试页面
        </h1>
        <p className="text-center text-gray-600 text-lg">
          测试新的现代化UI组件和印尼风格设计
        </p>
      </div>

      {/* Button 组件测试 */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Button 组件测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>按钮变体</CardTitle>
              <CardDescription>测试不同的按钮样式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">默认按钮</Button>
                <Button variant="secondary">次要按钮</Button>
                <Button variant="outline">轮廓按钮</Button>
                <Button variant="ghost">幽灵按钮</Button>
                <Button variant="link">链接按钮</Button>
                <Button variant="destructive">危险按钮</Button>
              </div>
              <div className="pt-4">
                <Button variant="indonesian" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  印尼风格按钮
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>按钮尺寸</CardTitle>
              <CardDescription>测试不同的按钮尺寸</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm">小按钮</Button>
                <Button size="default">默认尺寸</Button>
                <Button size="lg">大按钮</Button>
                <Button size="icon">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>带图标的按钮</CardTitle>
              <CardDescription>测试带图标的按钮</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="indonesian">
                  <BookOpen className="w-4 h-4 mr-2" />
                  开始学习
                </Button>
                <Button variant="outline">
                  <Trophy className="w-4 h-4 mr-2" />
                  查看成绩
                </Button>
                <Button variant="ghost">
                  <Users className="w-4 h-4 mr-2" />
                  社区
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Card 组件测试 */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Card 组件测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>基础卡片</CardTitle>
              <CardDescription>这是一个基础的卡片组件</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                这是卡片的内容区域，可以包含任何内容。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">了解更多</Button>
            </CardFooter>
          </Card>

          <Card className="border-indonesian-primary/20 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-indonesian-primary to-indonesian-secondary rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>印尼风格卡片</CardTitle>
                  <CardDescription>融入印尼文化元素的卡片设计</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                这个卡片使用了印尼传统的色彩搭配，体现了文化特色。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="indonesian" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                探索印尼文化
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学习进度</CardTitle>
              <CardDescription>显示学习统计信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">词汇掌握</span>
                <span className="text-lg font-semibold text-indonesian-primary">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-indonesian-primary to-indonesian-secondary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>已学: 425 个</span>
                <span>总计: 500 个</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Badge 组件测试 */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Badge 组件测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>徽章变体</CardTitle>
              <CardDescription>测试不同的徽章样式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">默认</Badge>
                <Badge variant="secondary">次要</Badge>
                <Badge variant="outline">轮廓</Badge>
                <Badge variant="destructive">危险</Badge>
                <Badge variant="indonesian">印尼风格</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>学习标签</CardTitle>
              <CardDescription>使用徽章显示学习状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">课程状态:</span>
                  <Badge variant="indonesian">进行中</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">难度等级:</span>
                  <Badge variant="secondary">中级</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">完成度:</span>
                  <Badge variant="default">75%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 综合展示 */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">综合展示</h2>
        <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-indonesian-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indonesian-primary to-indonesian-secondary rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">PiMi Bahasa</CardTitle>
                <CardDescription className="text-base">
                  现代化印尼语学习平台
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              这是一个使用现代化设计系统的印尼语学习平台。我们采用了 shadcn/ui 组件库，
              结合印尼传统文化元素，为用户提供优雅、专业的学习体验。
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="indonesian">React</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="default">现代化设计</Badge>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="indonesian" size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                开始学习
              </Button>
              <Button variant="outline" size="lg">
                <Users className="w-5 h-5 mr-2" />
                加入社区
              </Button>
              <Button variant="ghost" size="lg">
                <Globe className="w-5 h-5 mr-2" />
                了解更多
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentTest; 