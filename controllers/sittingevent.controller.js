SittingEventEntry = require('../models/sittingevent.model');
// Handle index actions
exports.getallsitdata = function (req, res) {
    SittingEventEntry.get(function (err, siteventdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Sit Event data retrieved successfully",
            data: siteventdata
        });
    });
};
// Handle create contact actions
exports.newsitentry = function (req, res) {
    var sitevententry = new SittingEventEntry();
    sitevententry.userid = req.body.userid;
    sitevententry.sit = req.body.sit;
    sitevententry.date=req.body.date;
    sitevententry.time=req.body.time;

// save the contact and check for errors
    sitevententry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Sit Event Entry Created!',
            data: sitevententry
        });
    });
};
