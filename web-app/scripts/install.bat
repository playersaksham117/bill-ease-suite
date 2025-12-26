@echo off
echo 🚀 BillEase Suite - Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

node -v
echo ✅ Node.js is installed
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

npm -v
echo ✅ npm is installed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚙️  Creating .env.local file...
    (
        echo # Supabase Configuration
        echo NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
        echo.
        echo # Optional: For admin operations
        echo SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
        echo.
        echo # App Configuration
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > .env.local
    echo ✅ Created .env.local - Please update with your Supabase credentials!
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🎉 Installation complete!
echo.
echo 📋 Next steps:
echo    1. Update .env.local with your Supabase credentials
echo    2. Create database table in Supabase (see QUICK_START.md)
echo    3. Run: npm run dev
echo.
echo 📚 Documentation:
echo    - QUICK_START.md - Quick setup guide
echo    - DEPLOYMENT.md - Full deployment guide
echo    - DATABASE_SCHEMA.md - Database structure
echo.
echo 🚀 Ready to code!
pause
