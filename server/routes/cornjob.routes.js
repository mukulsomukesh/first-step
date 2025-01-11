const express = require('express');
const { sendReminders } = require('../controllers/cornjob.controller');

const router = express.Router();

router.route('/revision-reminder').get(sendReminders);

module.exports = router