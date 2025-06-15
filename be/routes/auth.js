const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyInfo } = require('../controllers/authController.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMyInfo); 

module.exports = router;
