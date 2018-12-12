SitCycleEntry = require('../models/sitcycle.model');
// Handle index actions
exports.getallsitcycledata = function (req, res) {
    SitCycleEntry.get(function (err, sitcycledata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Sit Event data retrieved successfully",
            data: sitcycledata
        });
    });
};
// Handle create contact actions
exports.newsitcycle = function (req, res) {
    var sitcycleentry = new SitCycleEntry();
    sitcycleentry.userid = req.body.userid;
    sitcycleentry.date=req.body.date;
    sitcycleentry.time=req.body.time;

// save the contact and check for errors
    sitcycleentry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Sit Cycle Entry Created!',
            data: sitcycleentry
        });
    });
};
