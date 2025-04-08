const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const upload = require('../middleware/muleterconfig'); // Assuming you save the multer config in middleware/upload.js

router.post('/signup', upload, authController.signUp);
router.post('/signin', authController.signIn);
router.post('/refresh', authController.refreshToken);

module.exports = router;
