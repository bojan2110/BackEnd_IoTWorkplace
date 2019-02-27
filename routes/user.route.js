let router=require('express').Router();
// Import USER controller
var userController = require('../controllers/user.controller');
// Contact routes
router.route('/user/add').post(userController.addUserInfo);
router.route('/user/update').post(userController.updateUserInfo);
router.route('/user/get/:userid').get(userController.getUserInfo);
router.route('/user/dashboardinfo/post').post(userController.postDashboardInfo);
// Export API routes
module.exports = router;
