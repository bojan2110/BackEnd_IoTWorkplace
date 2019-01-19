let router =require('express').Router();
// Import contact controller

//

var sittingEventController = require('../controllers/sittingevent.controller');
// Contact routes
router.route('/sittingevent/:date/:hour?/:min?')
    .get(sittingEventController.getallsitdata)
    .post(sittingEventController.newsitentry);
// Export API routes
module.exports = router;
