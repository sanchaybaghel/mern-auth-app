const express = require('express');
const router = express.Router();
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const authController = require('../controllers/authController');

// Correct routes to match frontend API calls
router.post('/signup', upload.single('photo'), authController.sendOTPForSignup);
router.post('/verify-otp', authController.verifyOTPAndCreateUser);
router.post('/login', authController.login);

module.exports = router;