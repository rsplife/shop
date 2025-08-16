# Cloudflare Pages 部署指南

本指南将详细介绍如何将数字账号交易平台部署到Cloudflare Pages。

## 为什么选择Cloudflare Pages？

- ✅ **完全免费**：无限带宽和请求
- ✅ **全球CDN**：超快的访问速度
- ✅ **自动HTTPS**：免费SSL证书
- ✅ **Git集成**：自动部署
- ✅ **自定义域名**：免费绑定
- ✅ **无服务器函数**：支持动态功能

## 前置准备

1. **GitHub账号**（推荐）或GitLab/Bitbucket账号
2. **Cloudflare账号**
   - 访问 [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
   - 使用邮箱注册免费账号

## 部署步骤

### 第一步：准备代码仓库

#### 方法A：使用GitHub（推荐）

1. **创建GitHub仓库**
   - 访问 [https://github.com](https://github.com)
   - 点击右上角"+"号，选择"New repository"
   - 仓库名：`digital-trading-platform`
   - 设置为Public（公开）
   - 勾选"Add a README file"
   - 点击"Create repository"

2. **上传项目文件**
   
   **方法1：网页上传**
   - 在仓库页面点击"uploading an existing file"
   - 拖拽所有项目文件到上传区域
   - 提交信息："Initial commit"
   - 点击"Commit changes"
   
   **方法2：Git命令行**
   ```bash
   # 在项目目录下执行
   cd c:\Users\777\ai
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/rsplife/shop.git
   git push -u origin main
   ```

### 第二步：连接Cloudflare Pages

1. **登录Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 使用注册的账号登录

2. **创建Pages项目**
   - 在左侧菜单找到"Pages"
   - 点击"Create a project"
   - 选择"Connect to Git"

3. **连接Git仓库**
   - 选择"GitHub"（或其他Git平台）
   - 授权Cloudflare访问你的GitHub账号
   - 选择你的仓库：`shop`
   - 点击"Begin setup"

4. **配置构建设置**
   - **Project name**: `shop`
   - **Production branch**: `main`
   - **Build command**: 留空（静态网站不需要构建）
   - **Build output directory**: `/`（根目录）
   - 点击"Save and Deploy"

### 第三步：等待部署完成

1. **部署过程**
   - Cloudflare会自动开始部署
   - 通常需要1-3分钟完成
   - 可以在"Deployments"选项卡查看进度

2. **获取访问链接**
   - 部署成功后会显示访问链接
   - 格式：`https://项目名.pages.dev`
   - 例如：`https://shop.pages.dev`

## 自定义域名（可选）

如果你有自己的域名：

1. **在Cloudflare Pages中添加域名**
   - 进入项目设置
   - 点击"Custom domains"
   - 点击"Set up a custom domain"
   - 输入你的域名（如：`www.yoursite.com`）

2. **配置DNS记录**
   - 在你的域名注册商处添加CNAME记录：
     - 名称：`www`
     - 值：`项目名.pages.dev`
   - 或者将域名的DNS服务器改为Cloudflare的

## 自动部署

配置完成后，每次向GitHub仓库推送代码时，Cloudflare Pages会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "更新网站内容"
git push origin main
# Cloudflare会自动检测并重新部署
```

## 环境变量（如需要）

如果项目需要环境变量：

1. 在项目设置中找到"Environment variables"
2. 添加所需的变量
3. 重新部署项目

## 性能优化建议

1. **图片优化**
   - 使用WebP格式
   - 压缩图片大小
   - 使用Cloudflare的图片优化功能

2. **缓存设置**
   - Cloudflare自动处理缓存
   - 可在"Caching"设置中调整

3. **压缩**
   - 启用Gzip/Brotli压缩
   - 在"Speed"设置中配置

## 监控和分析

1. **访问统计**
   - 在"Analytics"选项卡查看访问数据
   - 包括页面浏览量、访客数等

2. **性能监控**
   - 查看页面加载速度
   - 监控错误率

## 常见问题

**Q: 部署后页面显示404？**
A: 确保index.html在仓库根目录，检查文件名大小写。

**Q: 修改代码后网站没有更新？**
A: 检查Git推送是否成功，查看Deployments页面的部署状态。

**Q: 自定义域名无法访问？**
A: 检查DNS记录是否正确配置，等待DNS传播（最多24小时）。

**Q: 网站加载速度慢？**
A: Cloudflare的全球CDN通常很快，检查图片大小和网络连接。

**Q: 如何回滚到之前版本？**
A: 在Deployments页面找到之前的部署，点击"Rollback"。

## 与其他平台对比

| 特性 | Cloudflare Pages | GitHub Pages | Netlify | Vercel |
|------|------------------|--------------|---------|--------|
| 免费带宽 | 无限 | 100GB/月 | 100GB/月 | 100GB/月 |
| 自定义域名 | ✅ | ✅ | ✅ | ✅ |
| 全球CDN | ✅ | ✅ | ✅ | ✅ |
| 构建时间 | 无限 | 无限 | 300分钟/月 | 100小时/月 |
| 无服务器函数 | ✅ | ❌ | ✅ | ✅ |
| DDoS防护 | ✅ | ❌ | ❌ | ❌ |

## 高级功能

1. **无服务器函数**
   - 支持处理表单提交
   - API端点创建
   - 动态内容生成

2. **A/B测试**
   - 流量分割测试
   - 性能对比

3. **访问控制**
   - IP白名单/黑名单
   - 地理位置限制

## 技术支持

- Cloudflare官方文档：[https://developers.cloudflare.com/pages/](https://developers.cloudflare.com/pages/)
- 社区论坛：[https://community.cloudflare.com/](https://community.cloudflare.com/)
- GitHub Issues：在项目仓库中提交问题

---

🚀 **开始部署你的网站到Cloudflare Pages吧！**