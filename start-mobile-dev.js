#!/usr/bin/env node

import { execSync } from 'child_process';
import { networkInterfaces } from 'os';

// Function to get local IP addresses
function getLocalIPs() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push({
          name: name,
          address: net.address
        });
      }
    }
  }

  return results;
}

// Function to check if port is available
function isPortAvailable(port) {
  try {
    execSync(`netstat -an | grep :${port}`, { stdio: 'ignore' });
    return false;
  } catch {
    return true;
  }
}

console.log('🚀 Mobile Development Server Setup');
console.log('=====================================\n');

// Get local IP addresses
const localIPs = getLocalIPs();

if (localIPs.length === 0) {
  console.log('❌ No local IP addresses found. Make sure you are connected to a network.');
  process.exit(1);
}

console.log('📱 Available IP addresses for mobile testing:');
localIPs.forEach((ip, index) => {
  console.log(`   ${index + 1}. ${ip.address} (${ip.name})`);
});

console.log('\n🔗 Mobile access URLs:');
localIPs.forEach((ip) => {
  console.log(`   http://${ip.address}:5173`);
});

console.log('\n📋 Instructions:');
console.log('1. Make sure your phone is connected to the same WiFi network as your computer');
console.log('2. Open your phone\'s browser and go to one of the URLs above');
console.log('3. The app should load and you can test the real-time features!');
console.log('\n⚠️  Note: If you have a firewall, you may need to allow connections on port 5173');

// Check if port is available
if (!isPortAvailable(5173)) {
  console.log('\n⚠️  Warning: Port 5173 might be in use. If the server doesn\'t start, try:');
  console.log('   npm run dev -- --port 3000');
}

console.log('\n🎯 Starting development server...\n');

// Start the development server
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.log('\n❌ Failed to start development server. Try running manually:');
  console.log('   npm run dev');
} 