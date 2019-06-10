let router =require('express').Router();
var timeSeriesController = require('../controllers/activity_time_series.controller');

router.route('/user/:userid/activity/:activity/date/:startdate/:enddate').get(timeSeriesController.getActivityTimeSeries);
router.route('/user/:userid/start/:startdate/end/:enddate').get(timeSeriesController.testSteps);

module.exports = router;
