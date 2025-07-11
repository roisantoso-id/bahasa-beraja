import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const SimpleTest = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">简单组件测试</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Button 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>Button 组件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="indonesian">印尼风格</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badge 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>Badge 组件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="outline">轮廓</Badge>
              <Badge variant="indonesian">印尼风格</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 测试 */}
        <Card>
          <CardHeader>
            <CardTitle>Card 组件</CardTitle>
          </CardHeader>
          <CardContent>
            <p>这是一个卡片组件的内容区域。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleTest; 