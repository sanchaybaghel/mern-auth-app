const express = require('express');
const router = express.Router();
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const authController = require('../controllers/authController');

router.post('/signup', upload.single('photo'), authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);

module.exports = router;