let router=require('express').Router();
// Import microphone controller
var idleStateController = require('../controllers/idlestate.controller');
// Contact routes
router.route('/idlestate/user/:userid/device/:deviceid/startdate/:startdate/enddate/:enddate').get(idleStateController.getIdleStateData);
router.route('/idlestate/post').post(idleStateController.new);
// Export API routes
module.exports = router;
