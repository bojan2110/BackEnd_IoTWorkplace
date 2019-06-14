let router=require('express').Router();
// Import microphone controller
var messagesController = require('../controllers/dashboardmessages.controller');
// Messages routes
router.route('/messages/:messagetype/:messageid?').get(messagesController.getmessages);
router.route('/messages/test').get(messagesController.test);
// Export API routes
module.exports = router;
