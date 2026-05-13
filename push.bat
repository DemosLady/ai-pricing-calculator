@echo off
chcp 65001 >nul

cd /d D:\Users\User\Downloads\ai-pricing-site

if "%~1"=="" (
    set MSG=update site
) else (
    set MSG=%*
)

echo.
echo === Pushing to GitHub ===
echo Message: %MSG%
echo.

git add .
git commit -m "%MSG%"
git push

echo.
echo === Done! Vercel will deploy in ~30 seconds ===
echo.
pause
