let router =require('express').Router();
// Import contact controller
//

var sitCycleController = require('../controllers/sitcycle.controller');
// Contact routes
router.route('/sitcycle/:date/:hour?/:min?')
    .get(sitCycleController.getallsitcycledata);
    // Export API routes
module.exports = router;
