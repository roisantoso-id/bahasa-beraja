// 临时的cn函数，直到我们安装依赖
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
} 