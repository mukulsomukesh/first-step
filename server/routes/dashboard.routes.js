const express = require('express');

const authMiddleware = require('../middleware/auth.middleware');
const { dashboardStats } = require('../controllers/dashboard.controller');


const router = express.Router();


router.route('/stats').get(authMiddleware,dashboardStats );
router.route('/schaduled-revision-and-todos').get(authMiddleware, );


module.exports = router