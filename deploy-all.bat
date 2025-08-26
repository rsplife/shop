@echo off
chcp 65001 >nul
echo ========================================
echo     数字账号交易平台 - 一键部署脚本
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "backend" (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查Git是否已初始化
if not exist ".git" (
    echo [信息] 初始化Git仓库...
    git init
    if errorlevel 1 (
        echo [错误] Git初始化失败，请检查Git是否已安装
        pause
        exit /b 1
    )
)

REM 检查是否已添加远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [信息] 添加GitHub远程仓库...
    git remote add origin https://github.com/rsplife/shop.git
    if errorlevel 1 (
        echo [错误] 添加远程仓库失败
        pause
        exit /b 1
    )
) else (
    echo [信息] 远程仓库已存在，跳过添加步骤
)

REM 提交并推送代码
echo [信息] 提交代码到Git...
git add .
git commit -m "Deploy: 数字账号交易平台部署 - %date% %time%"
if errorlevel 1 (
    echo [警告] 没有新的更改需要提交，或提交失败
)

echo [信息] 推送代码到GitHub...
git push -u origin main
if errorlevel 1 (
    echo [警告] 推送失败，可能需要先拉取远程更改
    echo [信息] 尝试拉取并合并...
    git pull origin main --allow-unrelated-histories
    git push -u origin main
    if errorlevel 1 (
        echo [错误] 推送失败，请手动解决冲突
        pause
        exit /b 1
    )
)

echo [成功] 代码已推送到GitHub
echo.

REM 检查Vercel CLI
echo [信息] 检查Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Vercel CLI未安装，请先安装：
    echo npm install -g vercel
    pause
    exit /b 1
)

echo [成功] Vercel CLI已安装
echo.

REM 部署后端
echo ========================================
echo           部署后端到Vercel
echo ========================================
cd backend

echo [信息] 开始部署后端...
vercel --prod
if errorlevel 1 (
    echo [错误] 后端部署失败
    cd ..
    pause
    exit /b 1
)

echo [成功] 后端部署完成
cd ..
echo.

REM 部署前端
echo ========================================
echo           部署前端到Vercel
echo ========================================

echo [信息] 开始部署前端...
vercel --prod
if errorlevel 1 (
    echo [错误] 前端部署失败
    pause
    exit /b 1
)

echo [成功] 前端部署完成
echo.

REM 显示部署结果
echo ========================================
echo           部署完成！
echo ========================================
echo.
echo [✓] 代码已推送到GitHub: https://github.com/rsplife/shop
echo [✓] 后端已部署到Vercel
echo [✓] 前端已部署到Vercel
echo.
echo 接下来需要完成的步骤：
echo.
echo 1. 在Vercel Dashboard配置环境变量：
echo    - 访问: https://vercel.com/reslifes-projects/shop
echo    - 配置数据库连接、JWT密钥、支付配置等
echo.
echo 2. 更新前端vercel.json中的后端代理地址
echo.
echo 3. 测试网站功能：
echo    - 用户注册/登录
echo    - 产品浏览和购买
echo    - 支付流程
echo.
echo 4. 配置自定义域名（可选）
echo.
echo 详细配置说明请查看: DEPLOYMENT-GUIDE.md
echo.
echo 按任意键退出...
pause >nul