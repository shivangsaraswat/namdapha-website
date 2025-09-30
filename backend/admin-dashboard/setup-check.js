#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Namdapha Admin Dashboard Setup Verification\n');

// Check if .env.local exists and has required variables
const envPath = path.join(__dirname, '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse env variables
  envContent.split('\n').forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      envVars[key.trim()] = value.trim();
    }
  });
  
  // Check required variables
  const required = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  let allPresent = true;
  
  required.forEach(key => {
    if (envVars[key] && envVars[key] !== 'your-secret-key-here' && envVars[key] !== 'your-google-client-id' && envVars[key] !== 'your-google-client-secret') {
      console.log(`✅ ${key}: Configured`);
    } else {
      console.log(`❌ ${key}: Missing or not configured`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('\n🎉 All environment variables are configured!');
  }
} else {
  console.log('❌ .env.local file not found');
}

// Check if auth.ts has authorized users
const authPath = path.join(__dirname, 'src/lib/auth.ts');
if (fs.existsSync(authPath)) {
  console.log('\n✅ auth.ts file found');
  const authContent = fs.readFileSync(authPath, 'utf8');
  
  // Count authorized users
  const userMatches = authContent.match(/"[^"]+@[^"]+"/g);
  if (userMatches && userMatches.length > 1) {
    console.log(`✅ ${userMatches.length} authorized users configured`);
    console.log('📧 Authorized emails:');
    userMatches.forEach(email => {
      console.log(`   - ${email.replace(/"/g, '')}`);
    });
  } else {
    console.log('⚠️  Only default admin user found. Add your email to authorized users.');
  }
} else {
  console.log('❌ auth.ts file not found');
}

// Check if required dependencies are installed
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredDeps = ['next-auth', '@auth/prisma-adapter', 'bcryptjs', 'jsonwebtoken'];
  
  console.log('\n📦 Checking dependencies:');
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: Not installed`);
    }
  });
}

console.log('\n🚀 Setup Instructions:');
console.log('1. Make sure Google OAuth is configured in Google Cloud Console');
console.log('2. Add your email to authorized users in src/lib/auth.ts');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');
console.log('5. Test login with your authorized email');

console.log('\n📋 Google OAuth Redirect URI should be:');
console.log('   http://localhost:3000/api/auth/callback/google');
console.log('   (Add this in Google Cloud Console)');