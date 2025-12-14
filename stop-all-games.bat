@echo off
echo ========================================
echo   Stopping All Algoverse Games
echo ========================================
echo.

echo Checking for processes on game ports...
echo.

REM Kill processes on port 3000 (Traffic Simulation)
echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo   Found process %%a on port 3000
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo   Could not kill process %%a (may need admin rights)
    ) else (
        echo   [OK] Killed process on port 3000
    )
)

REM Kill processes on port 3003 (Snake and Ladder)
echo Checking port 3003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003" ^| findstr "LISTENING"') do (
    echo   Found process %%a on port 3003
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo   Could not kill process %%a (may need admin rights)
    ) else (
        echo   [OK] Killed process on port 3003
    )
)

REM Kill processes on port 3002 (Traveling Salesman)
echo Checking port 3002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
    echo   Found process %%a on port 3002
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo   Could not kill process %%a (may need admin rights)
    ) else (
        echo   [OK] Killed process on port 3002
    )
)

REM Kill processes on port 5174 (Tower of Hanoi)
echo Checking port 5174...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174" ^| findstr "LISTENING"') do (
    echo   Found process %%a on port 5174
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo   Could not kill process %%a (may need admin rights)
    ) else (
        echo   [OK] Killed process on port 5174
    )
)

REM Kill processes on port 5175 (Eight Queens)
echo Checking port 5175...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5175" ^| findstr "LISTENING"') do (
    echo   Found process %%a on port 5175
    taskkill /PID %%a /F >nul 2>&1
    if errorlevel 1 (
        echo   Could not kill process %%a (may need admin rights)
    ) else (
        echo   [OK] Killed process on port 5175
    )
)

echo.
echo ========================================
echo   All game processes stopped!
echo   Ports should now be free.
echo ========================================
echo.
echo You can now run start-all-games.bat
echo.
timeout /t 2 /nobreak >nul

