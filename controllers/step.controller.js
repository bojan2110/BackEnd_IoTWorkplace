
Step = require('../models/step.model');
Sit = require('../models/sit.model');
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

    var stepdata = []

    for(const step of req.body){
      var stepentry = new Step();

      stepentry.userid = step.userid;
      stepentry.dataSource = step.dataSource;
      stepentry.collectionTime=step.collectionTime;
      stepentry.numSteps=step.numSteps;
      //sitting(0) or standing(1)
      if(step.numSteps<=2)
        stepentry.sit=1;
      else
        stepentry.sit=0;


      // console.log('userid')
      // console.log(step.userid)
      // console.log(stepentry)
      stepdata.push(stepentry)

    }
    // console.log('step data sent')
    // console.log(stepdata)
    //save the contact and check for errors
    Step.insertMany(stepdata,{ ordered: false },function (err) {
        if (err)
          {

            if(err.name === 'BulkWriteError')
            {
              var duplicates=[];
              var duplicates_ts=[];
              var input_ts=[];
              var new_ts=[];

                 try {
                   duplicates=JSON.parse(JSON.stringify(err.writeErrors,undefined,2));
                   duplicates_ts=duplicates.map(function (el) { return el.op.collectionTime; });
                   if(stepdata[0].userid == 'pixel')
                    console.log(duplicates_ts)
                   input_ts=stepdata.map(a => a.collectionTime)
                   new_ts = input_ts.filter(function(obj) { return duplicates_ts.indexOf(obj) == -1; });
                 } catch (e) {
                   console.log('BulkWriteError try catch',e)
                 }

              // var duplicates=JSON.parse(JSON.stringify(err.writeErrors,undefined,2));
              // var duplicates_ts=duplicates.map(function (el) { return el.op.collectionTime; });
              // var input_ts=stepdata.map(a => a.collectionTime)
              // var new_ts = input_ts.filter(function(obj) { return duplicates_ts.indexOf(obj) == -1; });


              console.log('Insert Steps User ' + stepdata[0].userid)
              // console.log(duplicates)
              console.log('duplicates length',duplicates_ts.length)
              console.log('new stepsdata length',input_ts.length)
              console.log('new insterted data',new_ts.length)

              res.json({message : "Some Step Entries Inserted", status : 200,timestamps:new_ts});

            }
            else{
              console.log('BulkWriteError',err)
              res.json(err);
            }

          }
          else{

            console.log('step data inserted for user')
            if(stepdata.length !=0)
              console.log(stepdata[0].userid)

            var ts=stepdata.map(a => a.collectionTime)
            console.log('success : "Step Entries Inserted", status : 200')
            res.json({message : "All Step Entries Inserted", status : 200,timestamps:ts});

          }
    });
};
