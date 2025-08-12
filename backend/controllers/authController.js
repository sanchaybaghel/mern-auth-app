const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { sendOTP, verifyOTP } = require('../utils/otp');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { fullName, email, password, confirmPassword, phone } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = req.file ? req.file.path || req.file.url : '';

    const user = new User({ fullName, email, password: hashedPassword, photo, phone });
    await user.save();

    const otp = sendOTP(phone); 

    res.status(201).json({ message: 'Signup successful, OTP sent to phone' });
};

exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    if (!verifyOTP(phone, otp)) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    await User.findOneAndUpdate({ phone }, { isVerified: true });
    res.json({ message: 'Phone verified, you can now login.' });
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

