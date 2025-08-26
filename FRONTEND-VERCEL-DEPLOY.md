# 前端 Vercel 部署指南

## 概述

本指南将帮助您将数字账号交易平台的前端项目部署到 Vercel。前端采用静态 HTML/CSS/JavaScript 架构，非常适合 Vercel 的静态网站托管服务。

## 部署配置

### 1. Vercel 配置文件

项目根目录的 `vercel.json` 文件已配置：

- **静态资源构建**：HTML、CSS、JS、SVG 文件
- **API 代理**：将 `/api/*` 请求代理到后端服务
- **安全头**：添加安全相关的 HTTP 头

### 2. 项目结构

```
前端项目/
├── index.html          # 主页
├── login.html          # 登录页
├── register.html       # 注册页
├── cart.html           # 购物车
├── admin.html          # 管理后台
├── styles.css          # 样式文件
├── script.js           # 主要脚本
├── config.js           # 配置文件
├── api.js              # API 调用
├── *.svg               # 图标文件
└── vercel.json         # Vercel 配置
```

## 部署步骤

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

在项目根目录运行：

```bash
vercel --prod
```

### 4. 配置环境变量

在 Vercel Dashboard 中配置以下环境变量：

- `NEXT_PUBLIC_API_URL`: 后端 API 地址
- `NEXT_PUBLIC_SITE_URL`: 前端站点地址

## 配置 API 代理

### 更新 vercel.json

将 `vercel.json` 中的后端域名替换为实际的后端 Vercel 部署地址：

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-actual-backend.vercel.app/api/$1"
    }
  ]
}
```

### 更新前端配置

修改 `config.js` 文件中的 API 基础地址：

```javascript
const config = {
    apiUrl: process.env.NODE_ENV === 'production' 
        ? '/api'  // 使用代理
        : 'http://localhost:3000/api'  // 本地开发
};
```

## 自动化部署

### 创建部署脚本

创建 `deploy-frontend.bat`：

```batch
@echo off
echo 部署前端到 Vercel...
echo.

echo 检查 Vercel CLI...
vercel --version
if %errorlevel% neq 0 (
    echo 安装 Vercel CLI...
    npm install -g vercel
)

echo.
echo 开始部署...
vercel --prod

echo.
echo 部署完成！
echo 请在 Vercel Dashboard 中配置环境变量
echo 并更新 API 代理地址
pause
```

## 域名配置

### 1. 自定义域名

在 Vercel Dashboard 中：
1. 进入项目设置
2. 点击 "Domains"
3. 添加自定义域名
4. 配置 DNS 记录

### 2. HTTPS 配置

Vercel 自动提供 HTTPS 证书，无需额外配置。

## 性能优化

### 1. 静态资源优化

- 压缩 CSS 和 JavaScript 文件
- 优化图片格式（使用 SVG）
- 启用 Gzip 压缩

### 2. 缓存策略

```json
{
  "headers": [
    {
      "source": "/(.*\\.(css|js|svg))$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 监控和分析

### 1. Vercel Analytics

在 Vercel Dashboard 中启用 Analytics 功能。

### 2. 性能监控

```javascript
// 添加到 script.js
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart);
    });
}
```

## 故障排除

### 常见问题

1. **API 请求失败**
   - 检查 API 代理配置
   - 确认后端服务正常运行
   - 检查 CORS 设置

2. **静态资源加载失败**
   - 检查文件路径
   - 确认文件存在
   - 检查 Vercel 构建日志

3. **部署失败**
   - 检查 vercel.json 语法
   - 确认文件权限
   - 查看部署日志

## 最佳实践

1. **版本控制**：使用 Git 管理代码
2. **环境分离**：区分开发和生产环境
3. **安全配置**：设置适当的安全头
4. **性能监控**：定期检查网站性能
5. **备份策略**：定期备份重要数据

## 成本优化

- **免费额度**：Vercel 提供慷慨的免费额度
- **带宽优化**：压缩静态资源
- **缓存策略**：合理设置缓存时间

## 支持和帮助

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel 社区](https://github.com/vercel/vercel/discussions)
- [部署故障排除](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)

---

通过以上配置，您的前端项目将能够在 Vercel 上稳定运行，享受全球 CDN 加速和自动 HTTPS 等优势。