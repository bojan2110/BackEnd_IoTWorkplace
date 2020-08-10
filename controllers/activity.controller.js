
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

      var activity = new Activity();
      activity.userid = req.body.userid;
      activity.dataSource = req.body.dataSource;
      activity.activityType = req.body.activityType;
      activity.confidence = req.body.confidence;
      activity.collectionTime=req.body.collectionTime;

    // save the contact and check for errors
      activity.save(function (err) {
          if (err)
              {
                res.json(err);
                console.log('error adding new activity')
                console.log(err)
              }
          else
          {
            console.log('new activity added ')
            res.json({
                      message: 'New activity Created!',
                      data: activity
                  });
          }
      });
    //save the contact and check for errors
    // Activity.insertMany(data,function (err) {
    //     if (err)
    //       {
    //         console.log(err)
    //         res.json(err);
    //       }
    //       else{
    //         // TODO: check if its more efficient to send only the min and max timestamp of the collection
    //         // then in the client side, we can generate all the possible timestamps in between and do the check in the file
    //         // as it is now, we might end up sending big arrays? - Check this.
    //
    //         // var maxTS=Math.max.apply(Math, data.map(function(o) { return o.collectionTime; }))
    //         // var minTS=Math.min.apply(Math, data.map(function(o) { return o.collectionTime; }))
    //         var ts=data.map(a => a.collectionTime)
    //         console.log('success : "Activity Entries Inserted", status : 200')
    //         res.json({message : "Activity Entries Inserted", status : 200,timestamps:ts});
    //     }
    // });
};
