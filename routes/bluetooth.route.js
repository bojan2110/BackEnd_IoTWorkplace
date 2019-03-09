let router =require('express').Router();

//

var bluetoothController = require('../controllers/bluetooth.controller');
// Contact routes
router.route('/bluetooth/get').get(bluetoothController.index);
router.route('/bluetooth/post').post(bluetoothController.new);

// Export API routes
module.exports = router;
