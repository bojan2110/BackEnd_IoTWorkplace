let router =require('express').Router();
// Import contact controller
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// 

var bluetoothController = require('../controllers/bluetooth.controller');
// Contact routes
router.route('/bluetooth')
    .get(bluetoothController.index)	
    .post(bluetoothController.new);
// Export API routes
module.exports = router;
