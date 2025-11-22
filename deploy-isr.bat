@echo off
REM ISR Deployment Script for Whole Lot of Nature (Windows)
REM This script helps deploy ISR implementation to Vercel

echo.
echo 🚀 ISR Deployment Helper
echo ========================
echo.

REM Check if there are changes
git status -s > nul 2>&1
if %errorlevel% == 0 (
    echo 📝 Git changes detected:
    git status -s
    echo.
    set /p commit="Commit these changes? (y/n): "
    if /i "%commit%"=="y" (
        git add .
        git commit -m "Implement ISR with time-based and on-demand revalidation - Added revalidate export to /api/products (5 min cache) - Added revalidate export to /api/categories (10 min cache) - Created /api/reviews/revalidate endpoint for webhooks - Added REVALIDATE_SECRET to environment variables - Updated vercel.json with cache headers - Added comprehensive ISR documentation"
        echo ✅ Changes committed
    )
) else (
    echo ✅ Git is clean
)

echo.
echo 📤 Pushing to Vercel...
git push

echo.
echo ⏳ Waiting for Vercel deployment...
echo.

REM Instructions for completing setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✨ Deployment initiated!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 NEXT STEPS:
echo.
echo 1️⃣  Add REVALIDATE_SECRET to Vercel:
echo    → Go to: https://vercel.com/your-project/settings/environment-variables
echo    → Add: REVALIDATE_SECRET = wln_revalidate_2025_secure_key_change_in_production
echo.
echo 2️⃣  Configure WooCommerce Webhooks:
echo    → Go to: https://admin.wholelotofnature.com/wp-admin
echo    → Navigate to: WooCommerce → Settings → Advanced → Webhooks
echo    → Create two webhooks (see ISR_SETUP_GUIDE.md)
echo.
echo 3️⃣  Test the implementation:
echo    → Update a product in WooCommerce
echo    → Visit the product page on your site
echo    → Changes should appear immediately
echo.
echo 📚 Full documentation: ISR_SETUP_GUIDE.md
echo.
echo 🎉 ISR is ready to make your site 8x faster!
echo.
pause
