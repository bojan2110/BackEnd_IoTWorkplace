let router=require('express').Router();
var cycleController = require('../controllers/cycle.controller');
router.route('/cycle/user/:userid/device/:deviceid?/startdate/:startdate/enddate/:enddate').get(cycleController.getGluedCycle);
