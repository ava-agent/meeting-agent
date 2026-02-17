@echo off
REM AI Meeting Web - CloudBase Deployment Script
REM 一站式会议助手 - CloudBase 部署脚本 (Windows)

echo ========================================
echo    AI 会议助手 - CloudBase 部署
echo ========================================
echo.

REM 检查环境变量文件
echo [1/4] 检查环境变量...
if not exist ".env.local" (
    echo [错误] 未找到 .env.local 文件
    echo 请先创建 .env.local 文件并配置必要的环境变量
    pause
    exit /b 1
)
echo [完成] 环境变量文件已找到
echo.

REM 构建生产版本
echo [2/4] 构建生产版本...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 构建失败
    pause
    exit /b 1
)
echo [完成] 构建成功
echo.

REM 检查输出目录
echo [3/4] 检查构建输出...
if not exist "out" (
    echo [错误] 未找到 out 目录
    pause
    exit /b 1
)
echo [完成] 静态文件已准备就绪
echo.

REM 部署说明
echo [4/4] 部署到 CloudBase
echo.
echo ========================================
echo    部署说明
echo ========================================
echo.
echo 方式一：使用 CloudBase CLI
echo   1. 安装 CLI: npm install -g @cloudbase/cli
echo   2. 登录: tcb login
echo   3. 部署: tcb hosting deploy out
echo.
echo 方式二：使用 CloudBase 控制台
echo   1. 访问: https://console.cloud.tencent.com/tcb
echo   2. 选择环境: ai-native-2gknzsob14f42138
echo   3. 进入「静态网站托管」
echo   4. 上传 out/ 目录中的所有文件
echo.
echo 部署后访问地址:
echo   https://ai-native-2gknzsob14f42138-1255322707.tcloudbaseapp.com/
echo.
echo ========================================
pause
