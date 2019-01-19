let router =require('express').Router();

//

var stepsController = require('../controllers/steps.controller');
// Contact routes
router.route('/steps/:date/:hour?/:min?').get(stepsController.getstepsbydate);
// Export API routes
module.exports = router;
