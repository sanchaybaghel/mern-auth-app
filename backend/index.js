const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-auth-app';

if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI not found in environment variables. Using default local MongoDB connection.');
    console.warn('⚠️  Make sure MongoDB is running locally or update your .env file.');
}

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Connected to: ${MONGO_URI}`);
})
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('💡 Make sure MongoDB is running and the connection string is correct.');
    console.error('💡 For local MongoDB: brew services start mongodb/brew/mongodb-community');
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'MERN Auth API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});