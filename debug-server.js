const http = require('http');
const fs = require('fs');
const path = require('path');

// 检查端口是否被占用
function checkPort(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(port, () => {
            server.close();
            resolve(false); // 端口可用
        });
        server.on('error', () => {
            resolve(true); // 端口被占用
        });
    });
}

// 检查文件是否存在
function checkFiles() {
    const files = [
        'package.json',
        'src/index.js',
        'src/App.js',
        'src/index.css',
        'tailwind.config.js',
        'postcss.config.js'
    ];
    
    console.log('📁 检查关键文件:');
    files.forEach(file => {
        const exists = fs.existsSync(file);
        console.log(`${exists ? '✅' : '❌'} ${file}`);
    });
}

// 检查依赖
function checkDependencies() {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        console.log('\n📦 检查依赖:');
        console.log(`✅ package.json 存在`);
        console.log(`📋 项目名称: ${packageJson.name}`);
        console.log(`📋 版本: ${packageJson.version}`);
        console.log(`📋 脚本: ${Object.keys(packageJson.scripts).join(', ')}`);
    } else {
        console.log('❌ package.json 不存在');
    }
}

// 检查端口状态
async function checkPorts() {
    console.log('\n🔌 检查端口状态:');
    const ports = [3000, 3001, 8080];
    
    for (const port of ports) {
        const isOccupied = await checkPort(port);
        console.log(`${isOccupied ? '🔴' : '🟢'} 端口 ${port}: ${isOccupied ? '被占用' : '可用'}`);
    }
}

// 主函数
async function main() {
    console.log('🔍 服务器诊断开始...\n');
    
    checkFiles();
    checkDependencies();
    await checkPorts();
    
    console.log('\n💡 建议:');
    console.log('1. 如果端口被占用，尝试使用其他端口');
    console.log('2. 如果文件缺失，检查项目结构');
    console.log('3. 如果依赖问题，运行 npm install');
    console.log('4. 清理缓存: rm -rf node_modules/.cache');
    
    console.log('\n🚀 启动命令:');
    console.log('npm start');
    console.log('或指定端口: PORT=3001 npm start');
}

main().catch(console.error); 