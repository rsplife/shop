@echo off
chcp 65001 >nul
echo ========================================
echo      推送代码到GitHub仓库
echo ========================================
echo.
echo 目标仓库: https://github.com/rsplife/shop
echo.

echo [1/4] 检查Git状态...
git status
if errorlevel 1 (
    echo ❌ 当前目录不是Git仓库，请先运行deploy.bat初始化
    pause
    exit /b 1
)

echo.
echo [2/4] 添加远程仓库...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 添加GitHub远程仓库...
    git remote add origin https://github.com/rsplife/shop.git
    echo ✅ 远程仓库添加成功
) else (
    echo ✅ 远程仓库已存在
)

echo.
echo [3/4] 添加并提交所有更改...
git add .
git commit -m "Update: 更新网站内容 - %date% %time%"
if errorlevel 1 (
    echo ⚠️  没有新的更改需要提交
) else (
    echo ✅ 提交完成
)

echo.
echo [4/4] 推送到GitHub...
git push -u origin main
if errorlevel 1 (
    echo ❌ 推送失败，请检查网络连接和GitHub权限
    echo.
    echo 可能的解决方案：
    echo 1. 检查网络连接
    echo 2. 确认GitHub仓库存在且有推送权限
    echo 3. 配置Git凭据: git config --global credential.helper store
    pause
    exit /b 1
) else (
    echo ✅ 推送成功！
)

echo.
echo ========================================
echo           推送完成！
echo ========================================
echo.
echo 🎉 代码已成功推送到GitHub仓库
echo 📍 仓库地址: https://github.com/rsplife/shop
echo.
echo 接下来可以：
echo 1. 在Cloudflare Pages连接此仓库进行部署
echo 2. 启用GitHub Pages（在仓库设置中）
echo 3. 查看部署文档: CLOUDFLARE-DEPLOY.md
echo.
pause