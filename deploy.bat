@echo off
chcp 65001 >nul
echo ========================================
echo    数字账号交易平台 - 快速部署脚本
echo ========================================
echo.

echo [1/5] 检查Git是否已安装...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git未安装，请先安装Git: https://git-scm.com/download
    pause
    exit /b 1
)
echo ✅ Git已安装

echo.
echo [2/5] 初始化Git仓库...
if not exist ".git" (
    git init
    echo ✅ Git仓库初始化完成
) else (
    echo ✅ Git仓库已存在
)

echo.
echo [3/5] 添加所有文件到Git...
git add .
echo ✅ 文件添加完成

echo.
echo [4/5] 创建初始提交...
git commit -m "Initial commit: 数字账号交易平台" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  没有新的更改需要提交
) else (
    echo ✅ 初始提交完成
)

echo.
echo [5/5] 设置主分支名称...
git branch -M main >nul 2>&1
echo ✅ 主分支设置为main

echo.
echo ========================================
echo           部署准备完成！
echo ========================================
echo.
echo 接下来请按照以下步骤完成部署：
echo.
echo 🚀 Cloudflare Pages部署（推荐）：
echo    1. GitHub仓库已准备: https://github.com/rsplife/shop
echo    2. 运行: git remote add origin https://github.com/rsplife/shop.git
echo    3. 运行: git push -u origin main
echo    4. 在Cloudflare Pages连接GitHub仓库
echo    5. 项目将部署到: https://shop.pages.dev
echo    详细步骤请查看: CLOUDFLARE-DEPLOY.md
echo.
echo 🇨🇳 Gitee Pages部署：
echo    1. 在Gitee创建新仓库（名称: shop）
echo    2. 复制仓库URL
echo    3. 运行: git remote add origin [Gitee仓库URL]
echo    4. 运行: git push -u origin main
echo    5. 在Gitee启用Pages服务
echo    详细步骤请查看: DEPLOY.md
echo.
echo 📚 更多信息请查看README.md文件
echo.
pause