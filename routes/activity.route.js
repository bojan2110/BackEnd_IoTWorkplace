let router=require('express').Router();
// Import microphone controller
var activityController = require('../controllers/activity.controller');
// Contact routes
router.route('/activity/get').get(activityController.index);
router.route('/activity/post').post(activityController.new);
// Export API routes
module.exports = router;
