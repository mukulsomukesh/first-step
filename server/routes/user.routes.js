const express = require('express');

const { registerUser, loginUser, forgotPassword, setNewPassword, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');


const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/update-password').post(setNewPassword);

router.route('/user-profile').get(authMiddleware, getUserProfile);
router.route('/update-user-profile').put(authMiddleware, updateUserProfile);


module.exports = router