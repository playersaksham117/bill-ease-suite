@echo off
REM Build script for Hostinger deployment (Windows)

echo 🚀 Building BillEase Suite for Hostinger...

REM Set environment to production
set NODE_ENV=production

REM Copy Hostinger environment file
if exist ".env.hostinger" (
  echo 📋 Copying Hostinger environment configuration...
  copy /Y .env.hostinger .env.production
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install --production=false

REM Build Next.js application
echo 🔨 Building Next.js application...
call npm run build

REM Create deployment package
echo 📦 Creating deployment package...
if not exist "dist" mkdir dist
xcopy /E /I /Y .next dist\.next
xcopy /E /I /Y public dist\public
copy /Y package.json dist\
copy /Y package-lock.json dist\
copy /Y next.config.js dist\
REM xcopy /E /I /Y node_modules dist\node_modules 2>nul || echo Skipping node_modules copy (install on server)

echo ✅ Build complete!
echo.
echo 📁 Deployment files are in the 'dist' folder
echo.
echo 🌐 Next steps for Hostinger:
echo 1. Upload 'dist' contents to your public_html directory
echo 2. In Hostinger panel: Setup ^> Node.js
echo 3. Set Node.js version to 18.x or higher
echo 4. Set Application Root to '/public_html'
echo 5. Set Application URL to your domain
echo 6. Set Application Startup File to 'node_modules/next/dist/bin/next'
echo 7. Set arguments: 'start'
echo 8. Click 'Create' or 'Update'
echo.
echo 💾 Database setup:
echo 1. Create MySQL database in cPanel
echo 2. Import 'database-hostinger.sql'
echo 3. Update .env.production with database credentials
echo.
echo 🔐 Default demo login:
echo    Email: demo@billease.com
echo    Password: demo123

pause
