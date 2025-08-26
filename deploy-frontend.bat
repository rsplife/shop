@echo off
chcp 65001 >nul
echo ========================================
echo     数字账号交易平台 - 前端部署脚本
echo ========================================
echo.

echo 检查 Vercel CLI 是否已安装...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo 安装失败，请手动安装: npm install -g vercel
        pause
        exit /b 1
    )
    echo Vercel CLI 安装成功！
) else (
    echo Vercel CLI 已安装
)

echo.
echo 开始部署前端到 Vercel...
echo.

vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo           部署成功！
    echo ========================================
    echo.
    echo 接下来请完成以下配置：
    echo.
    echo 1. 在 Vercel Dashboard 中配置环境变量：
    echo    - NEXT_PUBLIC_API_URL: 后端 API 地址
    echo    - NEXT_PUBLIC_SITE_URL: 前端站点地址
    echo.
    echo 2. 更新 vercel.json 中的后端代理地址
    echo.
    echo 3. 配置自定义域名（可选）
    echo.
    echo 4. 测试网站功能是否正常
    echo.
    echo 部署地址将在上方显示
    echo.
) else (
    echo.
    echo ========================================
    echo           部署失败！
    echo ========================================
    echo.
    echo 请检查：
    echo 1. 网络连接是否正常
    echo 2. Vercel 账户是否已登录
    echo 3. vercel.json 配置是否正确
    echo.
    echo 如需帮助，请查看 FRONTEND-VERCEL-DEPLOY.md
    echo.
)

echo 按任意键退出...
pause >nul