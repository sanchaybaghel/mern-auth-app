#!/usr/bin/env node

/**
 * Simple setup test script to verify the environment
 */

require('dotenv').config();

console.log('🧪 Testing MERN Auth App Setup...\n');

// Test 1: Environment Variables
console.log('1️⃣ Checking Environment Variables:');
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const optionalEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'CLOUDINARY_CLOUD_NAME'];

requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}: ${envVar === 'JWT_SECRET' ? '***hidden***' : process.env[envVar]}`);
    } else {
        console.log(`   ❌ ${envVar}: Missing`);
    }
});

console.log('\n   Optional Services:');
optionalEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value && !value.startsWith('your-')) {
        console.log(`   ✅ ${envVar}: Configured`);
    } else {
        console.log(`   ⚠️  ${envVar}: Not configured (development mode)`);
    }
});

// Test 2: MongoDB Connection
console.log('\n2️⃣ Testing MongoDB Connection:');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-auth-app';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('   ✅ MongoDB connection successful');
    console.log(`   📍 Connected to: ${MONGO_URI}`);
    
    // Test 3: Database Operations
    console.log('\n3️⃣ Testing Database Operations:');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    return TestModel.create({ test: 'setup-test' });
})
.then(() => {
    console.log('   ✅ Database write operation successful');
    
    // Clean up test document
    const TestModel = mongoose.model('Test');
    return TestModel.deleteMany({ test: 'setup-test' });
})
.then(() => {
    console.log('   ✅ Database cleanup successful');
    
    // Test 4: Dependencies
    console.log('\n4️⃣ Checking Dependencies:');
    
    try {
        require('express');
        console.log('   ✅ Express.js');
        
        require('bcryptjs');
        console.log('   ✅ bcryptjs');
        
        require('jsonwebtoken');
        console.log('   ✅ jsonwebtoken');
        
        require('cors');
        console.log('   ✅ CORS');
        
        require('multer');
        console.log('   ✅ Multer');
        
        require('twilio');
        console.log('   ✅ Twilio SDK');
        
        require('cloudinary');
        console.log('   ✅ Cloudinary SDK');
        
    } catch (err) {
        console.log(`   ❌ Missing dependency: ${err.message}`);
    }
    
    console.log('\n🎉 Setup test completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run: npm run dev (in backend directory)');
    console.log('   2. Run: npm start (in frontend directory)');
    console.log('   3. Visit: http://localhost:3000');
    console.log('\n💡 Tips:');
    console.log('   - OTP codes will be logged to console in development mode');
    console.log('   - Configure Twilio for real SMS functionality');
    console.log('   - Configure Cloudinary for image uploads');
    
    process.exit(0);
})
.catch((err) => {
    console.error('   ❌ Setup test failed:', err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
        console.log('\n💡 MongoDB Connection Tips:');
        console.log('   - Make sure MongoDB is running locally');
        console.log('   - macOS: brew services start mongodb/brew/mongodb-community');
        console.log('   - Linux: sudo systemctl start mongod');
        console.log('   - Windows: Start MongoDB service');
    }
    
    process.exit(1);
});
