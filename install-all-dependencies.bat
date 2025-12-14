@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Installing All Game Dependencies
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

echo This will install npm packages for all games.
echo This may take several minutes...
echo.

REM Create .env files for React apps
echo Creating .env files for port configuration...
if not exist "%ROOT_DIR%snake_and_ladder\.env" (
    echo PORT=3003 > "%ROOT_DIR%snake_and_ladder\.env"
    echo   Created snake_and_ladder\.env
)
if not exist "%ROOT_DIR%Travelling-Game\.env" (
    echo PORT=3002 > "%ROOT_DIR%Travelling-Game\.env"
    echo   Created Travelling-Game\.env
)
echo.

echo [1/5] Installing Traffic Simulation dependencies...
cd /d "%ROOT_DIR%traffic_simulation"
if exist node_modules (
    echo   Dependencies already installed, skipping...
) else (
    echo   Installing... (this may take a while)
    call npm install
    if errorlevel 1 (
        echo   ERROR: Installation failed!
        pause
    )
)
echo.

echo [2/5] Installing Snake and Ladder dependencies...
cd /d "%ROOT_DIR%snake_and_ladder"
if exist node_modules (
    echo   Dependencies already installed, skipping...
) else (
    echo   Installing... (this may take a while)
    call npm install
    if errorlevel 1 (
        echo   ERROR: Installation failed!
        pause
    )
)
echo.

echo [3/5] Installing Traveling Salesman dependencies...
cd /d "%ROOT_DIR%Travelling-Game"
if exist node_modules (
    echo   Dependencies already installed, skipping...
) else (
    echo   Installing... (this may take a while)
    call npm install
    if errorlevel 1 (
        echo   ERROR: Installation failed!
        pause
    )
)
echo.

echo [4/5] Installing Tower of Hanoi dependencies...
cd /d "%ROOT_DIR%Hanoi"
if exist node_modules (
    echo   Dependencies already installed, skipping...
) else (
    echo   Installing... (this may take a while)
    call npm install
    if errorlevel 1 (
        echo   ERROR: Installation failed!
        pause
    )
)
echo.

echo [5/5] Installing Eight Queens Frontend dependencies...
cd /d "%ROOT_DIR%eight-queens\frontend"
if exist node_modules (
    echo   Dependencies already installed, skipping...
) else (
    echo   Installing... (this may take a while)
    call npm install
    if errorlevel 1 (
        echo   ERROR: Installation failed!
        pause
    )
)
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Verification:
if exist "%ROOT_DIR%traffic_simulation\node_modules" (echo   [OK] Traffic Simulation) else (echo   [FAIL] Traffic Simulation)
if exist "%ROOT_DIR%snake_and_ladder\node_modules" (echo   [OK] Snake and Ladder) else (echo   [FAIL] Snake and Ladder)
if exist "%ROOT_DIR%Travelling-Game\node_modules" (echo   [OK] Traveling Salesman) else (echo   [FAIL] Traveling Salesman)
if exist "%ROOT_DIR%Hanoi\node_modules" (echo   [OK] Tower of Hanoi) else (echo   [FAIL] Tower of Hanoi)
if exist "%ROOT_DIR%eight-queens\frontend\node_modules" (echo   [OK] Eight Queens) else (echo   [FAIL] Eight Queens)
echo.
echo You can now run start-all-games.bat to start all games.
echo.
pause

