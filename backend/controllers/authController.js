const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { sendOTP, verifyOTP, storePendingUser, getPendingUser, deletePendingUser } = require('../utils/otp');
const jwt = require('jsonwebtoken');

// Step 1: Send OTP without creating user
exports.sendOTPForSignup = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, phone } = req.body;

        // Validate input
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or phone already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const photo = req.file ? req.file.path || req.file.url : '';

        // Store user data temporarily (not in database yet)
        const userData = { fullName, email, password: hashedPassword, photo, phone };
        storePendingUser(phone, userData);

        // Send OTP
        const otp = sendOTP(phone);

        res.status(200).json({ message: 'OTP sent to phone. Please verify to complete signup.' });
    } catch (error) {
        console.error('Signup OTP error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Step 2: Verify OTP and create user
exports.verifyOTPAndCreateUser = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        
        if (!verifyOTP(phone, otp)) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        
        const userData = getPendingUser(phone);
        if (!userData) {
            return res.status(400).json({ error: 'No pending signup found for this phone number' });
        }

        
        const user = new User({
            ...userData,
            isVerified: true
        });
        await user.save();

        // Clean up pending user data
        deletePendingUser(phone);

        res.status(201).json({ message: 'Account created successfully. You can now login.' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ error: 'Invalid credentials or not verified' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
};

