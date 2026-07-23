@echo off
title Elevate Edu - Web Server
color 0B
echo ===================================================
echo   DANG KHOI DONG HE THONG ELEVATE EDU (FRONTEND)
echo ===================================================
echo.
echo 1. Kiem tra va cai dat thu vien (Neu chua co)...
call npm install

echo.
echo 2. Khoi dong may chu web (Vite)...
echo.
echo [Thong bao]: Khi may chu chay len, ban hay copy duong link
echo http://localhost:3000 va dan vao trinh duyet de xem nhe!
echo.
call npm run dev

pause
