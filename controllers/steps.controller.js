StepsEntry = require('../models/steps.model');
// Handle index actions
exports.getallstepsdata = function (req, res) {
    StepsEntry.get(function (err, stepsdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Steps data retrieved successfully",
            data: stepsdata
        });
    });
};
// Handle create steps actions
exports.newstepentry = function (req, res) {
    var stepsentry = new StepsEntry();
    stepsentry.userid = req.body.userid;
    stepsentry.numsteps = req.body.numsteps;
    stepsentry.date=req.body.date;
    stepsentry.time=req.body.time;

// save the contact and check for errors
    stepsentry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Steps Entry Created!',
            data: stepsentry
        });
    });
};
