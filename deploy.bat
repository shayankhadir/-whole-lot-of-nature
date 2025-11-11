@echo off
echo ======================================
echo   VERCEL DEPLOYMENT HELPER
echo ======================================
echo.
echo This script will help you deploy to Vercel
echo.
echo Option 1: Via Vercel Dashboard (Easiest)
echo ------------------------------------------
echo 1. Go to: https://vercel.com/new
echo 2. Import your Git repository
echo 3. Add environment variables (see DEPLOY_NOW.md)
echo 4. Click Deploy
echo.
echo Option 2: Via Vercel CLI
echo ------------------------------------------
echo.
set /p install="Do you want to install Vercel CLI? (y/n): "
if /i "%install%"=="y" (
    echo Installing Vercel CLI...
    npm install -g vercel
    echo.
    echo Vercel CLI installed!
    echo.
    set /p login="Do you want to login now? (y/n): "
    if /i "%login%"=="y" (
        vercel login
    )
    echo.
    set /p deploy="Do you want to deploy now? (y/n): "
    if /i "%deploy%"=="y" (
        echo.
        echo Starting deployment...
        echo.
        vercel
    ) else (
        echo.
        echo Run 'vercel' command when ready to deploy
    )
) else (
    echo.
    echo No problem! You can deploy via dashboard:
    echo https://vercel.com/new
)
echo.
echo ======================================
echo   See DEPLOY_NOW.md for full guide
echo ======================================
echo.
pause
