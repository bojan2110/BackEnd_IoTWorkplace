
MicrophoneEntry = require('../models/microphoneentry.model');
// Handle index actions
exports.index = function (req, res) {
    MicrophoneEntry.get(function (err, micdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Microphone Data retrieved successfully!",
            data: micdata
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var micentry = new MicrophoneEntry();
    micentry.speakStatus = req.body.speakStatus ? req.body.speakStatus : micentry.speakStatus;
    micentry.collectionTime=req.body.collectionTime;

// save the contact and check for errors
    micentry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Microphone Entry Created!',
            data: micentry
        });
    });
};
