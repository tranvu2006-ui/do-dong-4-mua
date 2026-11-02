@echo off
title Khoi dong Do Dong 4 Mua
chcp 65001 >nul
echo ========================================================
echo   DỰ ÁN: ĐỔ ĐỐNG 4 MÙA (Node.js + React + Wamp MySQL)
echo ========================================================
echo Đang kiểm tra thư mục dự án...
cd /d "C:\DuAn\Do dong 4 mua"
echo.
echo Đang khởi động máy chủ Web tại http://localhost:3000 ...
echo Nhấn Ctrl + C để dừng máy chủ khi không sử dụng.
echo.
start http://localhost:3000
npm run dev
pause

