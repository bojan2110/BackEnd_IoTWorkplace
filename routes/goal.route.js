let router=require('express').Router();
// Import microphone controller
var goalController = require('../controllers/goal.controller');
// Contact routes
router.route('/goals/user/:userid').get(goalController.getGoals);
router.route('/goals/post').post(goalController.postGoals);

// Export API routes
module.exports = router;
