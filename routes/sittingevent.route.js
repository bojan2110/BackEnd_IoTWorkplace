let router =require('express').Router();
// Import contact controller
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
//

var sittingEventController = require('../controllers/sittingevent.controller');
// Contact routes
router.route('/sittingevent/:date/:hour?/:min?')
    .get(sittingEventController.getallsitdata)
    .post(sittingEventController.newsitentry);
// Export API routes
module.exports = router;
