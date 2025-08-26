# 数字账号交易平台 - 完整 Vercel 部署指南

## 项目概述

本项目包含前端（静态网站）和后端（Node.js API）两个部分，都将部署到 Vercel 平台。

## 项目结构

```
数字账号交易平台/
├── frontend/                    # 前端项目（根目录）
│   ├── index.html              # 主页
│   ├── login.html              # 登录页
│   ├── cart.html               # 购物车
│   ├── admin.html              # 管理后台
│   ├── styles.css              # 样式文件
│   ├── script.js               # 主要脚本
│   ├── config.js               # 配置文件
│   ├── api.js                  # API 调用
│   ├── vercel.json             # 前端 Vercel 配置
│   ├── deploy-frontend.bat     # 前端部署脚本
│   └── FRONTEND-VERCEL-DEPLOY.md
└── backend/                     # 后端项目
    ├── src/                    # 源代码
    ├── api/                    # Vercel Serverless 函数
    │   ├── index.js            # 主入口
    │   └── health.js           # 健康检查
    ├── vercel.json             # 后端 Vercel 配置
    ├── deploy-vercel.bat       # 后端部署脚本
    ├── VERCEL-DEPLOY.md        # 后端部署指南
    └── VERCEL-ENV-SETUP.md     # 环境变量配置
```

## 部署流程

### 第一步：部署后端 API

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **运行后端部署脚本**
   ```bash
   deploy-vercel.bat
   ```
   或手动执行：
   ```bash
   vercel --prod
   ```

3. **配置环境变量**
   - 在 Vercel Dashboard 中配置所有必需的环境变量
   - 参考 `backend/VERCEL-ENV-SETUP.md`

4. **记录后端域名**
   - 部署成功后，记录 Vercel 分配的域名
   - 例如：`https://your-backend-abc123.vercel.app`

### 第二步：配置前端 API 代理

1. **更新前端 vercel.json**
   ```json
   {
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://your-backend-abc123.vercel.app/api/$1"
       }
     ]
   }
   ```

2. **验证配置文件**
   - 确保 `config.js` 中的环境检测正常工作
   - API 地址应该使用 `/api` 代理路径

### 第三步：部署前端

1. **返回项目根目录**
   ```bash
   cd ..
   ```

2. **运行前端部署脚本**
   ```bash
   deploy-frontend.bat
   ```
   或手动执行：
   ```bash
   vercel --prod
   ```

3. **记录前端域名**
   - 例如：`https://your-frontend-xyz789.vercel.app`

### 第四步：配置域名和 CORS

1. **更新后端 CORS 配置**
   - 在后端环境变量中添加前端域名
   - `FRONTEND_URL=https://your-frontend-xyz789.vercel.app`

2. **配置自定义域名（可选）**
   - 前端：`www.yoursite.com`
   - 后端：`api.yoursite.com`

## 环境变量配置

### 后端环境变量

在 Vercel Dashboard 的后端项目中配置：

```env
# 数据库
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
REDIS_URL=redis://username:password@host:port

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# 安全
ENCRYPTION_KEY=your-32-character-encryption-key
HASH_SALT_ROUNDS=12

# 支付
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
WECHAT_APP_ID=your_wechat_app_id
WECHAT_MCH_ID=your_wechat_merchant_id
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# 邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
FRONTEND_URL=https://your-frontend-xyz789.vercel.app
```

### 前端环境变量

在 Vercel Dashboard 的前端项目中配置：

```env
# API 配置
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://your-frontend-xyz789.vercel.app

# 支付公钥
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
NEXT_PUBLIC_ALIPAY_APP_ID=your_alipay_app_id
```

## 推荐的外部服务

### 数据库服务

1. **MongoDB Atlas**
   - 免费套餐：512MB 存储
   - 注册：https://www.mongodb.com/atlas
   - 配置白名单：添加 `0.0.0.0/0`（Vercel IP）

2. **Upstash Redis**
   - 免费套餐：10,000 请求/天
   - 注册：https://upstash.com
   - 自动兼容 Vercel

### 支付服务

1. **支付宝开放平台**
   - 注册：https://open.alipay.com
   - 申请应用和商户号

2. **微信支付**
   - 注册：https://pay.weixin.qq.com
   - 申请商户号

3. **Stripe**
   - 注册：https://stripe.com
   - 国际信用卡支付

## 测试和验证

### 1. 健康检查

访问后端健康检查端点：
```
https://your-backend-abc123.vercel.app/api/health
```

应该返回：
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

### 2. API 测试

测试前端 API 代理：
```
https://your-frontend-xyz789.vercel.app/api/health
```

### 3. 功能测试

- 用户注册/登录
- 产品浏览
- 购物车功能
- 支付流程
- 管理后台

## 监控和维护

### 1. Vercel Analytics

在两个项目中都启用 Vercel Analytics：
- 访问量统计
- 性能监控
- 错误追踪

### 2. 日志监控

查看 Vercel Functions 日志：
- 进入项目 Dashboard
- 点击 "Functions" 标签
- 查看实时日志

### 3. 性能优化

- 启用 Vercel Edge Network
- 配置适当的缓存策略
- 压缩静态资源

## 故障排除

### 常见问题

1. **API 请求失败**
   - 检查代理配置
   - 验证后端服务状态
   - 检查 CORS 设置

2. **数据库连接失败**
   - 检查连接字符串
   - 验证网络白名单
   - 检查凭据

3. **支付功能异常**
   - 验证支付配置
   - 检查回调地址
   - 确认商户状态

### 调试技巧

1. **查看 Vercel 日志**
   ```bash
   vercel logs
   ```

2. **本地测试**
   ```bash
   vercel dev
   ```

3. **环境变量检查**
   ```bash
   vercel env ls
   ```

## 成本估算

### Vercel 费用

- **Hobby 计划**：免费
  - 100GB 带宽/月
  - 100 次构建/天
  - 适合个人项目

- **Pro 计划**：$20/月
  - 1TB 带宽/月
  - 3000 次构建/天
  - 适合商业项目

### 外部服务费用

- **MongoDB Atlas**：免费 - $57/月
- **Upstash Redis**：免费 - $320/月
- **支付手续费**：2.9% + $0.30/笔

## 安全最佳实践

1. **环境变量安全**
   - 不要在代码中硬编码密钥
   - 定期轮换密钥
   - 使用强密码

2. **API 安全**
   - 启用 HTTPS
   - 配置 CORS
   - 实施速率限制

3. **数据安全**
   - 加密敏感数据
   - 定期备份
   - 监控异常访问

## 总结

通过以上配置，您的数字账号交易平台将：

- ✅ 部署在全球 CDN 上，访问速度快
- ✅ 自动扩缩容，处理流量峰值
- ✅ 零服务器维护，专注业务开发
- ✅ 成本可控，按使用量付费
- ✅ 高可用性，99.99% 正常运行时间

部署完成后，您将拥有一个现代化、可扩展的数字账号交易平台！