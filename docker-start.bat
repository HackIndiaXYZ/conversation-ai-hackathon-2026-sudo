@echo off
REM ============================================
REM AI Healthcare Avatar Platform - Docker Starter
REM Windows Batch Script
REM ============================================

echo ============================================
echo AI Healthcare Avatar Platform
echo Docker Quick Start
echo ============================================
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.docker...
    copy .env.docker .env
    echo.
    echo [IMPORTANT] Please edit .env and configure:
    echo   - JWT_SECRET (generate a secure random string)
    echo   - MONGODB_URI (if using MongoDB Atlas)
    echo   - OLLAMA_URL (verify for your system)
    echo.
    pause
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/4] Checking Ollama availability...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Ollama doesn't appear to be running on localhost:11434
    echo.
    echo Please ensure Ollama is installed and running:
    echo   1. Download: https://ollama.com/download
    echo   2. Pull model: ollama pull phi3
    echo   3. Start: ollama serve
    echo.
    echo Continue anyway? (y/n)
    set /p CONTINUE=
    if /i not "%CONTINUE%"=="y" exit /b 1
)

echo.
echo [2/4] Building and starting containers...
docker compose up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers!
    pause
    exit /b 1
)

echo.
echo [3/4] Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Checking service health...
docker compose ps

echo.
echo ============================================
echo Platform is starting up!
echo ============================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:3001
echo MongoDB:  localhost:27017
echo.
echo Useful commands:
echo   docker compose logs -f    [View logs]
echo   docker compose down       [Stop all]
echo   docker compose ps         [Check status]
echo.
pause
