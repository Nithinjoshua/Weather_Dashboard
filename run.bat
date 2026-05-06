@echo off
TITLE Weather Dashboard Runner

echo ==========================================
echo   Starting Weather Dashboard Ecosystem
echo ==========================================

:: Start Backend
echo [1/2] Launching Backend Server...
start "Weather Dashboard - Backend" cmd /k "cd backend && npm start"

:: Start Frontend
echo [2/2] Launching Frontend Development Server...
start "Weather Dashboard - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   SUCCESS: Both servers are starting up!
echo   Close the new windows to stop servers.
echo ==========================================
pause
