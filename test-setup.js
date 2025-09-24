// Simple test script to verify the setup
console.log('Testing Task Tracker App Setup...');

// Test 1: Check if all required dependencies are available
const requiredDeps = [
  'expo',
  'react',
  'react-native',
  '@reduxjs/toolkit',
  'react-redux',
  'expo-sqlite',
  'expo-notifications',
  '@react-navigation/native',
  '@react-navigation/stack'
];

console.log('\n1. Checking dependencies...');
requiredDeps.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} - OK`);
  } catch (error) {
    console.log(`❌ ${dep} - MISSING`);
  }
});

// Test 2: Check SQLite API
console.log('\n2. Testing SQLite API...');
try {
  const SQLite = require('expo-sqlite');
  if (typeof SQLite.openDatabase === 'function') {
    console.log('✅ SQLite.openDatabase - Available');
  } else {
    console.log('❌ SQLite.openDatabase - Not available');
  }
  
  if (typeof SQLite.openDatabaseAsync === 'function') {
    console.log('✅ SQLite.openDatabaseAsync - Available');
  } else {
    console.log('❌ SQLite.openDatabaseAsync - Not available (using fallback)');
  }
} catch (error) {
  console.log('❌ SQLite - Error:', error.message);
}

// Test 3: Check Notifications API
console.log('\n3. Testing Notifications API...');
try {
  const Notifications = require('expo-notifications');
  if (typeof Notifications.setNotificationHandler === 'function') {
    console.log('✅ Notifications.setNotificationHandler - Available');
  } else {
    console.log('❌ Notifications.setNotificationHandler - Not available');
  }
} catch (error) {
  console.log('❌ Notifications - Error:', error.message);
}

console.log('\n✅ Setup test completed!');
console.log('\nTo run the app:');
console.log('1. npm install');
console.log('2. npm start');
console.log('3. Press "i" for iOS or "a" for Android');
