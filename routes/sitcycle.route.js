let router =require('express').Router();
// Import contact controller
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
//

var sitCycleController = require('../controllers/sitcycle.controller');
// Contact routes
router.route('/sitcycle/:date/:hour?/:min?')
    .get(sitCycleController.getallsitcycledata);
    // Export API routes
module.exports = router;
