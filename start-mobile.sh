#!/bin/bash

echo "🚀 Mobile Development Server Setup"
echo "====================================="
echo

echo "📱 Finding your local IP address..."

# Get local IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
else
    # Linux
    IP=$(hostname -I | awk '{print $1}')
fi

if [ -z "$IP" ]; then
    echo "❌ Could not find local IP address. Make sure you are connected to a network."
    exit 1
fi

echo "Found IP: $IP"
echo
echo "🔗 Mobile access URL: http://$IP:5173"
echo

echo "📋 Instructions:"
echo "1. Make sure your phone is connected to the same WiFi network as your computer"
echo "2. Open your phone's browser and go to: http://$IP:5173"
echo "3. The app should load and you can test the real-time features!"
echo
echo "⚠️  Note: If you have a firewall, you may need to allow connections on port 5173"
echo

echo "🎯 Starting development server..."
echo
npm run dev 