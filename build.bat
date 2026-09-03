@echo off
echo ================================================
echo    Building IA Item Manager for Windows
echo ================================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)

echo.
echo [3/3] Packaging Electron app...
call npm run package
if %errorlevel% neq 0 (
    echo ERROR: Failed to package Electron app
    pause
    exit /b 1
)

echo.
echo ================================================
echo    BUILD COMPLETED SUCCESSFULLY!
echo ================================================
echo.
echo Your executable files are in the "build_output" folder:
echo   - IA-Item-Manager-Portable.exe (double-click to run, no install needed)
echo   - IA Item Manager Setup 2.0.0.exe (installer version)
echo.
echo You can share IA-Item-Manager-Portable.exe with others!
echo.
pause
