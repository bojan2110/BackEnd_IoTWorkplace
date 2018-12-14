let router =require('express').Router();
// Import contact controller
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
//

var stepsController = require('../controllers/steps.controller');
// Contact routes
router.route('/steps/:date/:hour?/:min?').get(stepsController.getstepsbydate);
// Export API routes
module.exports = router;
