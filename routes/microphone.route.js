let router=require('express').Router();
// Import microphone controller
var microphoneController = require('../controllers/microphone.controller');
// Contact routes
router.route('/microphone/get').get(microphoneController.index);
router.route('/microphone/post').post(microphoneController.new);
// Export API routes
module.exports = router;
