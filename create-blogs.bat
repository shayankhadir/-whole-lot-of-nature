@echo off
echo.
echo ====================================
echo   Blog Post Creator
echo ====================================
echo.
echo Creating new blog posts...
echo.
node create-drafts-simple.mjs
echo.
echo.
echo ====================================
echo   Done!
echo ====================================
echo.
echo To publish drafts, visit:
echo http://localhost:3000/api/publisher/schedule?action=publish-now
echo.
pause
