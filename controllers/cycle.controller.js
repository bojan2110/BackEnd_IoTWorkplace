IdleState = require('../models/idlestate.model');


exports.getGluedCycle = function (req, res) {

    var userid=req.params.userid;
    // var deviceid=req.params.deviceid;
    var startdate=req.params.startdate;
    var enddate=req.params.enddate;

    var findquery = {
      "userid":userid,
      "collectionTime": {"$lte":enddate,"$gte":startdate}
    }
    if(req.params.deviceid)
    {
      findquery.deviceid  = req.params.deviceid
    }


    IdleState.find(findquery,
    function (err, idlestatedata) {
        if (err) {
          console.log('Error reading idle state data ',err)
            res.json({
                status: "error",
                message: err,
            });
        }
        else
        {
          if(idlestatedata === 'undefined')
          {
            console.log('idlestatedata undefined')
            res.json({
                status: "idlestatedata undefined",
                intervals:[]
            });
          }
          else if (idlestatedata.length == 0){
            console.log('idlestatedata 0 ')
            res.json({
                status: "idlestatedata 0",
                intervals:[]
            });
          }
          else{

           var intervalArray = createIntervals(idlestatedata,1,parseInt(startdate),parseInt(enddate))
           var cyclesArray = getInferredCycles(intervalArray.intervals).cycles
           var gluedCycles = glueCycles(cyclesArray)
            res.json({
                status: "success",
                intervals:gluedCycles
            });


          }
        }
      }
    );

};
