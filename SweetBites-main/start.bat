@echo off
REM SweetBites Quick Start Script for Windows

echo.
echo 🍰 SweetBites - Dynamic Bakery Website
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed.
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Installation complete!
echo.
echo 🚀 Starting server...
echo.
echo ════════════════════════════════════════
echo Server running at: http://localhost:3000
echo ════════════════════════════════════════
echo.
echo 📖 Available Pages:
echo   - Home: http://localhost:3000
echo   - Menu: http://localhost:3000/menu
echo   - Cart: http://localhost:3000/cart
echo   - Admin: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
