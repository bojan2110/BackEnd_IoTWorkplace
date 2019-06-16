
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
      console.log('userid')
      console.log(step.userid)
      console.log(stepentry)
      data.push(stepentry)
    }
    console.log('step data sent')
    console.log(data)

    //save the contact and check for errors
    Step.insertMany(data,{ ordered: false },function (err) {
        if (err)
          {

            if(err.name === 'BulkWriteError')
            {
              var duplicates=JSON.parse(JSON.stringify(err.writeErrors,undefined,2));
              var duplicates_ts=duplicates.map(function (el) { return el.op.collectionTime; });
              var input_ts=data.map(a => a.collectionTime)
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
            let mqttBroker=require('./mqttBroker');

            var packet = {
                topic: 'steps',
                payload: 20
            }
            mqttBroker.server.publish(packet, function() {
                logger.log('Packet sent to','tete');
            })

            console.log('step data inserted for user')
            if(data.length !=0)
              console.log(data[0].userid)

            var ts=data.map(a => a.collectionTime)
            console.log('success : "Step Entries Inserted", status : 200')
            res.json({message : "All Step Entries Inserted", status : 200,timestamps:ts});

          }
    });
};
