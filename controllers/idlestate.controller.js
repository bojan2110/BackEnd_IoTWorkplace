IdleState = require('../models/idlestate.model');

/* State events
    0 - user not active
    1 - user  active
    2 - device suspend
    3 - device resume
    4 - device on-ac
    5 - device on-battery
    6 - device shutdown
    7 - device lockscreen
    8 - device unlockscreen
    9 - application ON
    10 - application OFF
    */
// Handle index actions
exports.getIdleStateData = function (req, res) {

    var userid=req.params.userid;
    var deviceid=req.params.deviceid;
    var startdate=req.params.startdate;
    var enddate=req.params.enddate;

    var findquery={
      "userid":userid,
      "deviceid": deviceid,
      "collectionTime": {"$lte":enddate,"$gte":startdate}
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

            res.json({
                status: "success",
                intervals:idlestatedata
            });


          }
        }
      }
    );

};

exports.newState = function (req, res) {

  var idlestate = new IdleState();
  idlestate.userid = req.body.userid;
  idlestate.deviceid = req.body.deviceid;
  idlestate.collectionTime = req.body.collectionTime;
  idlestate.idleTime=req.body.idleTime;


  // save the contact and check for errors
  idlestate.save(function (err) {
      if (err)
          {
            res.json(err);
            console.log('error adding new idlestate')
            console.log(err)
          }
      else
      {
        console.log('new idlestate added')
        res.json({
                  message: 'New idlestate Created!',
                  data: idlestate
              });
      }
  });

};
