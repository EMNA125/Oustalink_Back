const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const upload = require('../middleware/muleterconfig'); // Assuming you save the multer config in middleware/upload.js

router.post('/signup', upload, authController.signUp);
router.post('/signin', authController.signIn);
router.post('/refresh', authController.refreshToken);
router.post('/reset-password-email', authController.resetPasswordController);
router.post('/update-password', authController.updatePasswordController);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/send-otp-email', authController.sendEmailOtp);
router.get('/google', authController.googleLogin);
router.get('/callback/google', authController.googleCallback);
module.exports = router;
