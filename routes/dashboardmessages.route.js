let router=require('express').Router();
// Import microphone controller
var messagesController = require('../controllers/dashboardmessages.controller');
// Messages routes
router.route('/messages/:messagetype').get(messagesController.getmessages);
// Export API routes
module.exports = router;
