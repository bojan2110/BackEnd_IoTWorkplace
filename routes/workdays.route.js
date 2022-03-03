let router=require('express').Router();
// Import microphone controller
var workdaysController = require('../controllers/workdays.controller');
// Contact routes
router.route('/workdays/user/:userid').get(workdaysController.getWorkDays);
router.route('/workdays/post').post(workdaysController.postWorkDays);

// Export API routes
module.exports = router;
