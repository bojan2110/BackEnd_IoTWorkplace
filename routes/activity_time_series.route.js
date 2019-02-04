let router =require('express').Router();
var timeSeriesController = require('../controllers/activity_time_series.controller');

router.route('/user/:userid/activity/:activity/date/:startdate/:enddate').get(timeSeriesController.getActivityTimeSeries);

module.exports = router;
