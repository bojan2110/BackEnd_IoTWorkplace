let router=require('express').Router();
// Import microphone controller
var stepController = require('../controllers/step.controller');
// Contact routes
router.route('/step/get').get(stepController.index);
router.route('/step/post').post(stepController.new);
// Export API routes
module.exports = router;
