let router =require('express').Router();
var timeSeriesController = require('../controllers/activity_time_series.controller');

router.route('/user/:userid/startdate/:startdate/enddate/:enddate').get(timeSeriesController.getActivityData);

module.exports = router;
