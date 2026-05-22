@echo off
echo Starting Hunter Academy Server...
cd "%~dp0\server"
npm install
node server.js
pause
