
Step = require('../models/step.model');
// Handle index actions
exports.index = function (req, res) {
    Step.get(function (err, stepdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Step Data retrieved successfully!",
            data: stepdata
        });
    });
};

exports.new = function (req, res) {

    var data = []
    for(const step of req.body){
      var stepentry = new Step();
      stepentry.userid = step.userid;
      stepentry.dataSource = step.dataSource;
      stepentry.collectionTime=stepentry.collectionTime;
      data.push(stepentry)
    }
    //save the contact and check for errors
    Step.insertMany(data,function (err) {
        if (err)
          {
            res.json(err);
          }
          else{
            res.json([{success : "Step Entries Inserted", status : 200}]);
        }
    });
};
