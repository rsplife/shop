# 项目部署指南

## 项目信息

- **Vercel 项目地址**: https://vercel.com/reslifes-projects/shop
- **GitHub 仓库地址**: https://github.com/rsplife/shop
- **项目名称**: 数字账号交易平台

## 部署步骤

### 第一步：推送代码到 GitHub

1. **初始化 Git 仓库**（如果还没有）
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 数字账号交易平台"
   ```

2. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/rsplife/shop.git
   ```

3. **推送代码到 GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### 第二步：配置 Vercel 项目

#### 后端部署配置

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **链接到现有项目**
   ```bash
   vercel --prod
   ```
   - 选择 "Link to existing project"
   - 选择 "reslifes-projects/shop"
   - 确认项目设置

#### 前端部署配置

1. **返回根目录**
   ```bash
   cd ..
   ```

2. **创建新的 Vercel 项目（前端）**
   ```bash
   vercel --prod
   ```
   - 选择 "Create new project"
   - 项目名称：`shop-frontend`

### 第三步：配置环境变量

#### 后端环境变量

在 Vercel Dashboard (https://vercel.com/reslifes-projects/shop) 中配置：

```env
# 数据库配置
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop
REDIS_URL=redis://username:password@host:port

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-32-characters
JWT_EXPIRES_IN=7d

# 安全配置
ENCRYPTION_KEY=your-32-character-encryption-key-here
HASH_SALT_ROUNDS=12

# 支付配置
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
WECHAT_APP_ID=your_wechat_app_id
WECHAT_MCH_ID=your_wechat_merchant_id
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS 配置
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### 前端环境变量

在前端 Vercel 项目中配置：

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
```

### 第四步：更新配置文件

#### 更新前端 vercel.json

修改根目录的 `vercel.json` 文件：

```json
{
  "version": 2,
  "name": "shop-frontend",
  "builds": [
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.css",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.js",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.svg",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://shop-backend-domain.vercel.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 第五步：自动化部署

#### 使用提供的脚本

1. **后端部署**
   ```bash
   cd backend
   ./deploy-vercel.bat
   ```

2. **前端部署**
   ```bash
   cd ..
   ./deploy-frontend.bat
   ```

#### 或者手动部署

```bash
# 后端
cd backend
vercel --prod

# 前端
cd ..
vercel --prod
```

### 第六步：验证部署

#### 检查后端健康状态

访问：`https://your-backend-domain.vercel.app/api/health`

期望响应：
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "services": {
    "mongodb": "connected",
    "redis": "connected"
  }
}
```

#### 测试前端功能

1. 访问前端域名
2. 测试用户注册/登录
3. 测试产品浏览
4. 测试购物车功能
5. 测试支付流程

### 第七步：配置自定义域名（可选）

#### 在 Vercel Dashboard 中：

1. 进入项目设置
2. 点击 "Domains"
3. 添加自定义域名：
   - 前端：`www.yoursite.com`
   - 后端：`api.yoursite.com`
4. 配置 DNS 记录

### 推荐的外部服务

#### 数据库服务

1. **MongoDB Atlas**
   - 注册：https://www.mongodb.com/atlas
   - 创建免费集群（512MB）
   - 配置网络访问：添加 `0.0.0.0/0`
   - 获取连接字符串

2. **Upstash Redis**
   - 注册：https://upstash.com
   - 创建 Redis 数据库
   - 获取连接 URL

#### 支付服务

1. **支付宝开放平台**
   - 注册：https://open.alipay.com
   - 创建应用
   - 获取 APP_ID 和私钥

2. **微信支付**
   - 注册：https://pay.weixin.qq.com
   - 申请商户号
   - 获取配置信息

3. **Stripe**
   - 注册：https://stripe.com
   - 获取 API 密钥

### 故障排除

#### 常见问题

1. **部署失败**
   - 检查 `vercel.json` 语法
   - 确认所有依赖已安装
   - 查看 Vercel 构建日志

2. **API 请求失败**
   - 检查 CORS 配置
   - 验证环境变量
   - 确认代理设置

3. **数据库连接失败**
   - 检查连接字符串
   - 验证网络白名单
   - 确认凭据正确

#### 调试命令

```bash
# 查看 Vercel 日志
vercel logs

# 本地测试
vercel dev

# 检查环境变量
vercel env ls
```

### 监控和维护

1. **启用 Vercel Analytics**
2. **设置错误监控**
3. **定期检查性能**
4. **更新依赖包**

### 成本估算

- **Vercel Hobby**: 免费（适合个人项目）
- **Vercel Pro**: $20/月（适合商业项目）
- **MongoDB Atlas**: 免费 - $57/月
- **Upstash Redis**: 免费 - $320/月

---

## 快速部署命令

```bash
# 1. 推送代码
git add .
git commit -m "Deploy to production"
git push origin main

# 2. 部署后端
cd backend
vercel --prod

# 3. 部署前端
cd ..
vercel --prod

# 4. 验证部署
curl https://your-backend-domain.vercel.app/api/health
```

部署完成后，您的数字账号交易平台将在全球 CDN 上运行，享受高性能和高可用性！