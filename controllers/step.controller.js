
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
      stepentry.collectionTime=step.collectionTime;
      stepentry.numSteps=step.numSteps;
      data.push(stepentry)
    }
    console.log('step data sent')
    console.log(data)

    //save the contact and check for errors
    Step.insertMany(data,{ ordered: false },function (err) {
        if (err)
          {

            console.log(JSON.stringify(e.getWriteErrors(),undefined,2));
            res.json(err);
          }
          else{
            console.log('step data inserted')
            console.log(data)
            var ts=data.map(a => a.collectionTime)
            console.log('success : "Step Entries Inserted", status : 200')
            res.json({message : "Step Entries Inserted", status : 200,timestamps:ts});
        }
    });
};
