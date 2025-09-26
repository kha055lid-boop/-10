@echo off
echo 
echo 
REM التحقق من وجود Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 
    echo    : https://nodejs.org/
    pause
    exit /b 1
)

REM التحقق من وجود XAMPP
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 
    echo    XAMPP
    echo    MySQL
    pause
    exit /b 1
)

echo 
echo 

REM إنشاء قاعدة البيانات إذا لم تكن موجودة
echo 
mysql -u root -e "CREATE DATABASE IF NOT EXISTS namaa_db;" 2>nul
if %errorlevel% neq 0 (
    echo 
    echo    XAMPP
    pause
    exit /b 1
)

REM الانتقال للمجلد الخلفي وتثبيت التبعيات
echo 
cd backend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo 
        pause
        exit /b 1
    )
)

REM الانتقال للمجلد الأمامي وتثبيت التبعيات
echo 
cd ../frontend
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo 
        pause
        exit /b 1
    )
)

REM تشغيل الخادم الخلفي في نافذة جديدة
echo 
cd ../backend
start "Backend Server" cmd /k "npm start"

REM انتظار ثانيتين للتأكد من تشغيل الخادم الخلفي
timeout /t 3 /nobreak >nul

REM تشغيل الواجهة الأمامية في نافذة جديدة
echo 
cd ../frontend
start "Frontend App" cmd /k "npm start"

echo.
echo 
echo 
echo    http://localhost:3000
echo.
echo 
echo    admin
echo    admin123
echo.
echo 
echo    Command Prompt
echo.
echo    QUICK_START.md
echo.
echo    
