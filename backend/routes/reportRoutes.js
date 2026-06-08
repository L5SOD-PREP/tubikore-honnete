const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.get('/', ReportController.getReport);
router.get('/full', ReportController.getFullReport);

module.exports = router;
