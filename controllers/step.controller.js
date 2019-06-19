
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

      console.log('userid')
      console.log(step.userid)
      console.log(stepentry)
      stepdata.push(stepentry)

    }
    console.log('step data sent')
    console.log(stepdata)

    //save the contact and check for errors
    Step.insertMany(stepdata,{ ordered: false },function (err) {
        if (err)
          {

            if(err.name === 'BulkWriteError')
            {
              var duplicates=JSON.parse(JSON.stringify(err.writeErrors,undefined,2));
              var duplicates_ts=duplicates.map(function (el) { return el.op.collectionTime; });
              var input_ts=stepdata.map(a => a.collectionTime)
              var new_ts = input_ts.filter(function(obj) { return duplicates_ts.indexOf(obj) == -1; });

              console.log(duplicates_ts.length)
              console.log(input_ts.length)
              console.log(new_ts.length)

              res.json({message : "Some Step Entries Inserted", status : 200,timestamps:new_ts});

            }
            else{
              res.json(err);
            }

          }
          else{
              //creating the sitdata
            var sitdata = []
            for(const entry of stepdata){
              var sitentry = new Sit();

              sitentry.userid = entry.userid;
              sitentry.dataSource = entry.dataSource;
              sitentry.collectionTime=entry.collectionTime;


              console.log('userid')
              console.log(step.userid)


                //user sits
                if(entry.numSteps<=2)
                  sitentry.status=0;
                else
                  sitentry.status=1;

              console.log('sitentry',sitentry)
              sitdata.push(sitentry)
            }

            //inserting sit data in mongo
            Sit.insertMany(sitdata,{ ordered: false },function (err) {
                if (err)
                {
                    res.json(err);
                }
                else{
                  console.log('sit data inserted for user')
                  if(sitdata.length !=0)
                    console.log(sitdata[0].userid)

                  //var ts=stepdata.map(a => a.collectionTime)
                  console.log('success : "Sit Entries Inserted", status : 200')
                  //res.json({message : "All Sit Entries Inserted", status : 200,timestamps:ts});
                }

              });

            console.log('step data inserted for user')
            if(stepdata.length !=0)
              console.log(stepdata[0].userid)

            var ts=stepdata.map(a => a.collectionTime)
            console.log('success : "Step Entries Inserted", status : 200')
            res.json({message : "All Step Entries Inserted", status : 200,timestamps:ts});

          }
    });
};
