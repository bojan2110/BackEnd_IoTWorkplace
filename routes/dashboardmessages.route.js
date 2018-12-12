let router=require('express').Router();
// Import microphone controller
var messagesController = require('../controllers/dashboardmessages.controller');
// Contact routes
router.route('/messages')
    .get(messagesController.index)
    .post(messagesController.new);
// Export API routes
module.exports = router;
