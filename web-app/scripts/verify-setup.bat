@echo off
echo.
echo ========================================
echo    BillEase Suite - Setup Verification
echo ========================================
echo.

set ERROR_COUNT=0

echo [1/7] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ Node.js not found
    set /a ERROR_COUNT+=1
) else (
    node -v
    echo    ✅ Node.js installed
)
echo.

echo [2/7] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ npm not found
    set /a ERROR_COUNT+=1
) else (
    npm -v
    echo    ✅ npm installed
)
echo.

echo [3/7] Checking node_modules...
if exist "node_modules\" (
    echo    ✅ Dependencies installed
) else (
    echo    ❌ Dependencies not installed - Run: npm install
    set /a ERROR_COUNT+=1
)
echo.

echo [4/7] Checking Supabase packages...
if exist "node_modules\@supabase\supabase-js\" (
    echo    ✅ @supabase/supabase-js installed
) else (
    echo    ❌ @supabase/supabase-js not found
    set /a ERROR_COUNT+=1
)

if exist "node_modules\@supabase\ssr\" (
    echo    ✅ @supabase/ssr installed
) else (
    echo    ❌ @supabase/ssr not found
    set /a ERROR_COUNT+=1
)
echo.

echo [5/7] Checking .env.local...
if exist ".env.local" (
    echo    ✅ .env.local exists
    findstr /C:"your-project-url" .env.local >nul
    if %ERRORLEVEL% EQU 0 (
        echo    ⚠️  WARNING: .env.local contains placeholder values
        echo       Please update with your Supabase credentials
    ) else (
        echo    ✅ .env.local appears configured
    )
) else (
    echo    ❌ .env.local not found
    echo       Create it from .env.local template
    set /a ERROR_COUNT+=1
)
echo.

echo [6/7] Checking required files...
set MISSING_FILES=0

if not exist "lib\supabase\client.ts" (
    echo    ❌ lib\supabase\client.ts missing
    set /a MISSING_FILES+=1
)

if not exist "lib\supabase\server.ts" (
    echo    ❌ lib\supabase\server.ts missing
    set /a MISSING_FILES+=1
)

if not exist "middleware.ts" (
    echo    ❌ middleware.ts missing
    set /a MISSING_FILES+=1
)

if %MISSING_FILES% EQU 0 (
    echo    ✅ All required Supabase files present
) else (
    echo    ❌ %MISSING_FILES% required files missing
    set /a ERROR_COUNT+=1
)
echo.

echo [7/7] Checking documentation...
if exist "QUICK_START.md" (
    echo    ✅ QUICK_START.md found
) else (
    echo    ⚠️  QUICK_START.md not found
)

if exist "DEPLOYMENT.md" (
    echo    ✅ DEPLOYMENT.md found
) else (
    echo    ⚠️  DEPLOYMENT.md not found
)

if exist "DATABASE_SCHEMA.md" (
    echo    ✅ DATABASE_SCHEMA.md found
) else (
    echo    ⚠️  DATABASE_SCHEMA.md not found
)
echo.

echo ========================================
echo.

if %ERROR_COUNT% EQU 0 (
    echo ✅ All checks passed! You're ready to go!
    echo.
    echo 📋 Next steps:
    echo    1. Update .env.local with Supabase credentials
    echo    2. Create database table in Supabase
    echo    3. Run: npm run dev
    echo.
    echo 📚 See QUICK_START.md for detailed instructions
) else (
    echo ❌ Found %ERROR_COUNT% error^(s^)
    echo.
    echo 🔧 To fix:
    echo    1. Run: npm install
    echo    2. Create/update .env.local file
    echo    3. Run this check again: scripts\verify-setup.bat
    echo.
    echo 📚 See QUICK_START.md for help
)

echo.
echo ========================================
pause
