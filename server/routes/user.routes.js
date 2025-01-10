const express = require('express');

const { registerUser, loginUser, forgotPassword, setNewPassword } = require('../controllers/user.controller');


const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/update-password').post(setNewPassword);

module.exports = router