@echo off
echo 🚀 Mobile Development Server Setup
echo =====================================
echo.

echo 📱 Finding your local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%a
    set ip=!ip: =!
    echo Found IP: !ip!
    echo.
    echo 🔗 Mobile access URL: http://!ip!:5173
    echo.
)

echo 📋 Instructions:
echo 1. Make sure your phone is connected to the same WiFi network as your computer
echo 2. Open your phone's browser and go to: http://!ip!:5173
echo 3. The app should load and you can test the real-time features!
echo.
echo ⚠️  Note: If you have a firewall, you may need to allow connections on port 5173
echo.

echo 🎯 Starting development server...
echo.
npm run dev 