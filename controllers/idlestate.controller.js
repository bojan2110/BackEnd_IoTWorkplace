IdleState = require('../models/idlestate.model');
IdleStateAppEvents = require('../models/idleStateAppEvents.model');

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

exports.newEvent = function (req, res) {

  var idlestateapp = new IdleStateAppEvents();
  idlestateapp.userid = req.body.userid;
  idlestateapp.deviceid = req.body.deviceid;
  idlestateapp.collectionTime = req.body.collectionTime;
  idlestateapp.eventid=req.body.eventid;


  // save the contact and check for errors
  idlestateapp.save(function (err) {
      if (err)
          {
            res.json(err);
            console.log('error adding new idlestate app event')
            console.log(err)
          }
      else
      {
        console.log('new idlestate app event added')
        res.json({
                  message: 'New idlestate app event created!',
                  data: idlestateapp
              });
      }
  });

};


exports.getIdleStateAppEvents = function (req, res) {

    var userid=req.params.userid;
    var deviceid=req.params.deviceid;
    var startdate=req.params.startdate;
    var enddate=req.params.enddate;

    var findquery={
      "userid":userid,
      "deviceid": deviceid,
      "collectionTime": {"$lte":enddate,"$gte":startdate}
    }

    IdleStateAppEvents.find(findquery,
    function (err, idlestateAppEvents) {
        if (err) {
          console.log('Error reading idlestateAppEvents data ',err)
            res.json({
                status: "error",
                message: err,
            });
        }
        else
        {
          if(idlestateAppEvents === 'undefined')
          {
            console.log('idlestateAppEvents undefined')
            res.json({
                status: "idlestateAppEvents undefined",
                intervals: []
            });
          }
          else if (idlestateAppEvents.length == 0){
            console.log('idlestateAppEvents 0 ')
            res.json({
                status: "idlestateAppEvents 0",
                intervals: []
            });
          }
          else{
            res.json({
                status: "success",
                intervals:idlestateAppEvents
            });

          }
        }
      }
    );
};
