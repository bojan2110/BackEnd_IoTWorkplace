
MessagesEntry = require('../models/dashboardmessages.model.js');
// Handle index actions
exports.index = function (req, res) {
    MessagesEntry.get(function (err, messagesdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Messages Data retrieved successfully",
            data: messagesdata
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var msgentry = new MessagesEntry();
    msgentry.id = req.body.id;
    msgentry.message = req.body.message;
    msgentry.author=req.body.author;
    msgentry.type=req.body.type;

// save the contact and check for errors
    msgentry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Message Entry Created!',
            data: msgentry
        });
    });
};
