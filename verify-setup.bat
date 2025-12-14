@echo off
echo ========================================
echo   Verifying Algoverse Setup
echo ========================================
echo.

set "ROOT_DIR=%~dp0"
set "ALL_OK=1"

REM Check Node.js
echo Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] Node.js is not installed or not in PATH
    set "ALL_OK=0"
) else (
    for /f "tokens=*" %%i in ('node --version') do echo   [OK] Node.js version: %%i
)

REM Check npm
echo Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo   [FAIL] npm is not installed or not in PATH
    set "ALL_OK=0"
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo   [OK] npm version: %%i
)
echo.

REM Check dependencies
echo Checking game dependencies...
if exist "%ROOT_DIR%traffic_simulation\node_modules" (
    echo   [OK] Traffic Simulation
) else (
    echo   [FAIL] Traffic Simulation - run: cd traffic_simulation ^&^& npm install
    set "ALL_OK=0"
)

if exist "%ROOT_DIR%snake_and_ladder\node_modules" (
    echo   [OK] Snake and Ladder
) else (
    echo   [FAIL] Snake and Ladder - run: cd snake_and_ladder ^&^& npm install
    set "ALL_OK=0"
)

if exist "%ROOT_DIR%Travelling-Game\node_modules" (
    echo   [OK] Traveling Salesman
) else (
    echo   [FAIL] Traveling Salesman - run: cd Travelling-Game ^&^& npm install
    set "ALL_OK=0"
)

if exist "%ROOT_DIR%Hanoi\node_modules" (
    echo   [OK] Tower of Hanoi
) else (
    echo   [FAIL] Tower of Hanoi - run: cd Hanoi ^&^& npm install
    set "ALL_OK=0"
)

if exist "%ROOT_DIR%eight-queens\frontend\node_modules" (
    echo   [OK] Eight Queens
) else (
    echo   [FAIL] Eight Queens - run: cd eight-queens\frontend ^&^& npm install
    set "ALL_OK=0"
)
echo.

REM Check .env files
echo Checking port configuration files...
if exist "%ROOT_DIR%snake_and_ladder\.env" (
    echo   [OK] snake_and_ladder\.env
) else (
    echo   [WARN] snake_and_ladder\.env missing (will use PORT env var)
)

if exist "%ROOT_DIR%Travelling-Game\.env" (
    echo   [OK] Travelling-Game\.env
) else (
    echo   [WARN] Travelling-Game\.env missing (will use PORT env var)
)
echo.

REM Check vite configs
echo Checking Vite configurations...
if exist "%ROOT_DIR%Hanoi\vite.config.js" (
    findstr /C:"port: 5174" "%ROOT_DIR%Hanoi\vite.config.js" >nul 2>&1
    if errorlevel 1 (
        echo   [WARN] Hanoi vite.config.js port may not be set correctly
    ) else (
        echo   [OK] Hanoi vite.config.js
    )
) else (
    echo   [FAIL] Hanoi vite.config.js not found
    set "ALL_OK=0"
)

if exist "%ROOT_DIR%eight-queens\frontend\vite.config.js" (
    findstr /C:"port: 5175" "%ROOT_DIR%eight-queens\frontend\vite.config.js" >nul 2>&1
    if errorlevel 1 (
        echo   [WARN] Eight Queens vite.config.js port may not be set correctly
    ) else (
        echo   [OK] Eight Queens vite.config.js
    )
) else (
    echo   [FAIL] Eight Queens vite.config.js not found
    set "ALL_OK=0"
)
echo.

echo ========================================
if "%ALL_OK%"=="1" (
    echo   Setup looks good! You can run start-all-games.bat
) else (
    echo   Setup incomplete! Please run install-all-dependencies.bat first
)
echo ========================================
echo.
pause

