@echo off
REM Production Build Script for Hostinger Deployment (Windows)
REM Run this script before deploying to Hostinger

echo 🚀 Starting production build...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run type check
echo 🔍 Running type check...
call npm run type-check

REM Build the application
echo 🏗️  Building application...
call npm run build

echo ✅ Build complete!
echo.
echo 📁 Your production files are ready in the 'out/' folder
echo 📤 Upload the contents of 'out/' folder to your Hostinger public_html directory
echo.
echo 📋 Don't forget to:
echo    1. Set environment variables in Hostinger
echo    2. Upload .htaccess file
echo    3. Enable SSL certificate
echo    4. Update Supabase redirect URLs
echo.
echo 🎉 Happy deploying!
pause
