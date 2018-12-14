StepsEntry = require('../models/steps.model');
// Handle index actions
exports.getstepsbydate = function (req, res) {
  var date=req.params.date;
  var hour=req.params.hour;
  var min=req.params.min;

    StepsEntry.find({$or:[{'date':date,'hour':{ $lte: hour},'minute': {$lte: min}},{'date':date,'hour':{ $lt: hour}}]},
    function (err, messagesdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        // return array (messagesData) is empty
        if (!messagesdata.length) {
          res.json({
              status: "success",
              numcycles: 0
          });
        }

        else{
          // sortedarray=messagesdata.sort(function(a, b) {
          //     return parseFloat(a.hour) - parseFloat(b.hour) || parseFloat(a.minute) - parseFloat(b.minute);
          // });
          totalSteps=0
          for (i = 0; i < messagesdata.length; i++) {  //loop through the array
              totalSteps += messagesdata[i].numsteps;  //Do the math!
          }

          res.json({
              status: "success",
              total_steps: totalSteps
          });
      }
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
