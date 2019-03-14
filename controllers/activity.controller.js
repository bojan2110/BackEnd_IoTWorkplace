
Activity = require('../models/recognizedactivity.model');
// Handle index actions
exports.index = function (req, res) {
    Activity.get(function (err, actdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Activity Data retrieved successfully!",
            data: actdata
        });
    });
};

exports.new = function (req, res) {

    var data = []
    for(const act of req.body){
      var actentry = new Activity();
      actentry.userid = act.userid;
      actentry.activityType = actentry.activityType;
      actentry.confidence = actentry.confidence;
      actentry.collectionTime=act.collectionTime;
      data.push(actentry)
    }
    //save the contact and check for errors
    Activity.insertMany(data,function (err) {
        if (err)
          {
            res.json(err);
          }
          else{
            res.json([{success : "Activity Entries Inserted", status : 200}]);
        }
    });
};
