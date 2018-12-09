let router=require('express').Router();
// Import microphone controller
var microphoneController = require('../controllers/microphone.controller');
// Contact routes
router.route('/microphone')
    .get(microphoneController.index)
    .post(microphoneController.new);
// Export API routes
module.exports = router;
