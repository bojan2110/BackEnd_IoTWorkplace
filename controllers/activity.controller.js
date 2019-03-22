
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
      actentry.activityType = act.activityType;
      actentry.confidence = act.confidence;
      actentry.collectionTime=act.collectionTime;
      data.push(actentry)
    }
    //save the contact and check for errors
    Activity.insertMany(data,function (err) {
        if (err)
          {
            console.log(err)
            res.json(err);
          }
          else{
            // TODO: check if its more efficient to send only the min and max timestamp of the collection
            // then in the client side, we can generate all the possible timestamps in between and do the check in the file
            // as it is now, we might end up sending big arrays? - Check this.

            // var maxTS=Math.max.apply(Math, data.map(function(o) { return o.collectionTime; }))
            // var minTS=Math.min.apply(Math, data.map(function(o) { return o.collectionTime; }))
            var ts=data.map(a => a.collectionTime)
            console.log('success : "Activity Entries Inserted", status : 200')
            res.json({message : "Activity Entries Inserted", status : 200,timestamps:ts});
        }
    });
};
