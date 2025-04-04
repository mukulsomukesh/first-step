const express = require('express');

const authMiddleware = require('../middleware/auth.middleware');
const { dashboardStats, scheduledRevisionsAndTodos, getStudyProgressChartData } = require('../controllers/dashboard.controller');


const router = express.Router();


router.route('/stats').get(authMiddleware,dashboardStats );
router.route('/schaduled-revision-and-todos').get(authMiddleware, scheduledRevisionsAndTodos);
router.route('/study-progress-chart-data').get(authMiddleware, getStudyProgressChartData);


module.exports = router