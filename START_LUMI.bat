@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Start Lumi

echo.
echo Starting Lumi...
echo This window will install anything missing, then open two more windows.
echo.

where node >nul 2>&1
if errorlevel 1 goto MissingNode
where npm >nul 2>&1
if errorlevel 1 goto MissingNode

for /f "tokens=1,2 delims=." %%A in ('node -v') do (
  set "NODE_MAJOR=%%A"
  set "NODE_MINOR=%%B"
)
set "NODE_MAJOR=%NODE_MAJOR:v=%"
if "%NODE_MAJOR%"=="" goto OldNode
if %NODE_MAJOR% LSS 20 goto OldNode
if %NODE_MAJOR% EQU 20 if %NODE_MINOR% LSS 19 goto OldNode

set "PYCMD="
where py >nul 2>&1 && set "PYCMD=py -3"
if not defined PYCMD (
  where python >nul 2>&1 && set "PYCMD=python"
)
if not defined PYCMD goto MissingPython

%PYCMD% -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)"
if errorlevel 1 goto OldPython

if not exist "backend\app\main.py" goto MissingProject
if not exist "frontend\package.json" goto MissingProject
if not exist "backend\requirements.txt" goto MissingProject

if not exist "backend\.venv\Scripts\python.exe" (
  echo Creating the Python environment...
  %PYCMD% -m venv "backend\.venv"
  if errorlevel 1 goto VenvFailed
)

set "NEED_PIP="
"backend\.venv\Scripts\python.exe" -c "import fastapi, uvicorn, sqlalchemy, pydantic" >nul 2>&1
if errorlevel 1 set "NEED_PIP=1"
if not exist "backend\.venv\.requirements-stamp" set "NEED_PIP=1"
if exist "backend\.venv\.requirements-stamp" (
  fc /b "backend\requirements.txt" "backend\.venv\.requirements-stamp" >nul
  if errorlevel 1 set "NEED_PIP=1"
)
if defined NEED_PIP (
  echo Installing backend requirements...
  "backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
  if errorlevel 1 goto PipFailed
  copy /y "backend\requirements.txt" "backend\.venv\.requirements-stamp" >nul
)

set "NEED_NPM="
if not exist "frontend\node_modules\vite\package.json" set "NEED_NPM=1"
if not exist "frontend\node_modules\.package-lock-stamp" set "NEED_NPM=1"
if exist "frontend\node_modules\.package-lock-stamp" (
  fc /b "frontend\package-lock.json" "frontend\node_modules\.package-lock-stamp" >nul
  if errorlevel 1 set "NEED_NPM=1"
)
if defined NEED_NPM (
  echo Installing frontend dependencies. The first time can take a few minutes...
  pushd "frontend"
  call npm install
  if errorlevel 1 (
    popd
    goto NpmFailed
  )
  copy /y "package-lock.json" "node_modules\.package-lock-stamp" >nul
  popd
)

call :PortBusy 8000
if "%PORT_BUSY%"=="1" (
  echo.
  echo Port 8000 is already in use, so the backend was not started again.
  echo Close the existing Lumi backend window if that was an old copy, then run this file again.
  goto EndPause
)
call :PortBusy 4731
if "%PORT_BUSY%"=="1" (
  echo.
  echo Port 4731 is already in use, so the frontend was not started again.
  echo Close the existing Lumi frontend window if that was an old copy, then run this file again.
  goto EndPause
)

echo.
echo Starting the backend on port 8000...
start "Lumi backend" cmd /k cd /d "%~dp0backend" ^& "%~dp0backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000

echo Starting the frontend on port 4731...
start "Lumi frontend" cmd /k cd /d "%~dp0frontend" ^& npm run dev

echo.
echo Waiting for the page. The first start can take a minute...
set "TRIES=0"
:WaitSite
set /a TRIES+=1
curl.exe -fsS -o NUL http://127.0.0.1:4731
if not errorlevel 1 goto OpenSite
if %TRIES% GEQ 45 goto SiteSlow
timeout /t 2 /nobreak >nul
goto WaitSite

:OpenSite
start "" "http://localhost:4731"
echo.
echo Lumi is running at http://localhost:4731
echo.
echo Leave the "Lumi backend" and "Lumi frontend" windows open while you use it.
echo Close those two windows to stop Lumi. If a window asks to terminate the job, press Y.
goto EndPause

:SiteSlow
echo.
echo The servers were started, but the page was not ready yet.
echo Wait until the Lumi frontend window says it is ready, then open http://localhost:4731
goto EndPause

:MissingNode
echo Node.js was not found.
echo Install Node.js 22 from https://nodejs.org/
echo Then close this window and double-click START_LUMI.bat again.
goto EndFail

:OldNode
echo Node.js is installed, but it is too old.
echo Install Node.js 22, or at least Node.js 20.19, from https://nodejs.org/
echo Then close this window and double-click START_LUMI.bat again.
goto EndFail

:MissingPython
echo Python was not found.
echo Install Python 3.11 or newer from https://www.python.org/downloads/
echo On the installer, tick "Add python.exe to PATH".
echo Then close this window and double-click START_LUMI.bat again.
goto EndFail

:OldPython
echo Python is installed, but it is older than 3.11.
echo Install Python 3.11 or newer from https://www.python.org/downloads/
echo Then close this window and double-click START_LUMI.bat again.
goto EndFail

:MissingProject
echo This file must stay in the Lumi folder, next to the frontend and backend folders.
goto EndFail

:VenvFailed
echo The Python environment could not be created.
echo See RUN_LUMI.md for the manual commands.
goto EndFail

:PipFailed
echo Backend requirements could not be installed.
echo See RUN_LUMI.md for the manual commands.
goto EndFail

:NpmFailed
echo Frontend dependencies could not be installed.
echo See RUN_LUMI.md for the manual commands.
goto EndFail

:PortBusy
set "PORT_BUSY="
netstat -ano | findstr "LISTENING" | findstr ":%1 " >nul
if not errorlevel 1 set "PORT_BUSY=1"
exit /b 0

:EndFail
echo.
pause
exit /b 1

:EndPause
echo.
pause
exit /b 0
