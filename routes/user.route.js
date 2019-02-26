let router=require('express').Router();
// Import microphone controller
var userController = require('../controllers/user.controller');
// Contact routes
router.route('/user/add').post(userController.addUser);
router.route('/user/get/:userid').get(userController.getUser);
// Export API routes
module.exports = router;
