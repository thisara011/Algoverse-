@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Starting All Algoverse Games
echo ========================================
echo.

REM Get the directory where this batch file is located
set "ROOT_DIR=%~dp0"

REM Check if npm is available
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not found in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Checking for port conflicts...
echo.

REM Check if ports are in use
netstat -ano | findstr ":3003" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 3003 is already in use!
    echo   This may prevent Snake and Ladder from starting.
    echo   Run stop-all-games.bat to free the ports, or close the existing process.
    echo.
)

netstat -ano | findstr ":3002" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 3002 is already in use!
    echo   This may prevent Traveling Salesman from starting.
    echo   Run stop-all-games.bat to free the ports, or close the existing process.
    echo.
)

echo Checking dependencies...
echo.

REM Check if dependencies are installed
if not exist "%ROOT_DIR%traffic_simulation\node_modules" (
    echo ERROR: Traffic Simulation dependencies not installed!
    echo Please run: cd traffic_simulation ^&^& npm install
    echo.
    pause
    exit /b 1
)

if not exist "%ROOT_DIR%snake_and_ladder\node_modules" (
    echo WARNING: Snake and Ladder dependencies missing!
    echo Please run: cd snake_and_ladder ^&^& npm install
    echo.
    pause
)

if not exist "%ROOT_DIR%Travelling-Game\node_modules" (
    echo WARNING: Traveling Salesman dependencies missing!
    echo Please run: cd Travelling-Game ^&^& npm install
    echo.
    pause
)

if not exist "%ROOT_DIR%Hanoi\node_modules" (
    echo WARNING: Tower of Hanoi dependencies missing!
    echo Please run: cd Hanoi ^&^& npm install
    echo.
    pause
)

if not exist "%ROOT_DIR%eight-queens\frontend\node_modules" (
    echo WARNING: Eight Queens dependencies missing!
    echo Please run: cd eight-queens\frontend ^&^& npm install
    echo.
    pause
)

echo Starting games...
echo.

REM Start Traffic Simulation
echo [1/5] Starting Traffic Simulation (Main Hub) on port 3000...
start "Traffic Simulation - Port 3000" cmd /k "cd /d "%ROOT_DIR%traffic_simulation" && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Snake and Ladder
echo [2/5] Starting Snake and Ladder on port 3003...
start "Snake and Ladder - Port 3003" cmd /k "cd /d "%ROOT_DIR%snake_and_ladder" && set PORT=3003 && npm start"
timeout /t 3 /nobreak >nul

REM Start Traveling Salesman
echo [3/5] Starting Traveling Salesman on port 3002...
start "Traveling Salesman - Port 3002" cmd /k "cd /d "%ROOT_DIR%Travelling-Game" && set PORT=3002 && npm start"
timeout /t 3 /nobreak >nul

REM Start Tower of Hanoi
echo [4/5] Starting Tower of Hanoi on port 5174...
start "Tower of Hanoi - Port 5174" cmd /k "cd /d "%ROOT_DIR%Hanoi" && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Eight Queens
echo [5/5] Starting Eight Queens Frontend on port 5175...
start "Eight Queens - Port 5175" cmd /k "cd /d "%ROOT_DIR%eight-queens\frontend" && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   All games are starting!
echo   Please wait for them to load.
echo   Main hub: http://localhost:3000
echo.
echo   Check each terminal window for:
echo   - Traffic Simulation: http://localhost:3000
echo   - Snake and Ladder: http://localhost:3003
echo   - Traveling Salesman: http://localhost:3002
echo   - Tower of Hanoi: http://localhost:5174
echo   - Eight Queens: http://localhost:5175
echo.
echo   If a game doesn't start, check its terminal
echo   window for error messages.
echo ========================================
echo.
pause
