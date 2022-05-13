let router=require('express').Router();

var idleStateController = require('../controllers/idlestate.controller');

router.route('/idlestate/user/:userid/device/:deviceid?/startdate/:startdate/enddate/:enddate').get(idleStateController.getIdleStateDataPerPeriod);
router.route('/idlestate/cycles/user/:userid/device/:deviceid?/startdate/:startdate/enddate/:enddate').get(idleStateController.getGluedCycle);

router.route('/idlestate/user/:userid/device/:deviceid?/limit/:limit/sort/:sort').get(idleStateController.getIdleStateDataPerLimit);
router.route('/idlestate/post').post(idleStateController.newState);


// Export API routes
module.exports = router;
