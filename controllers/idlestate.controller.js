IdleState = require('../models/idlestate.model');
function createIntervals(states,slidingWindowMinutes,sTime,eTime){

    // array that will contain the calculated intervals
      var intervalArray = {
          intervals: []
      };

      //interval length in seconds
      var intervalLength = slidingWindowMinutes*60

      // sort the intervals as sometimes app OFF is saved after app ON
      states = states.sort(function(a, b) {  return a.collectionTime - b.collectionTime;});

      var currentTime
      var dayStart
      if(sTime==undefined)
      //get current timestamp
      {
        var start = new Date();
        start.setHours(0,0,0,0);
        dayStart =  Math.floor(start.getTime()/1000)
      }
      else
        dayStart = sTime


      if(eTime==undefined)
      //get current timestamp
      {
        var end = new Date();
        currentTime = Math.floor(end.getTime())/1000;
      }
      else
        currentTime = eTime


      // console.log('sTime dayStart eTime currentTime', sTime, dayStart, eTime, currentTime)

        // these two are like interval slider start and end point
      var intervalStart = dayStart
      var intervalEnd = intervalStart + intervalLength - 1



      //only if there are states to be calculated in the day
      if(states.length != 0)
      {

            while(intervalStart<=currentTime){
              //valid for the last interval in case that it exceed the currentTime
              if(intervalEnd>currentTime)
              {
                    intervalEnd = currentTime
              }

              var slicedStates = states.filter(function (el) { return el.collectionTime >= intervalStart && el.collectionTime <= intervalEnd });
              //there is data in the sliced interval
              if(slicedStates.length !=0)
                 slicedStates = slicedStates.sort(function(a, b) { return a.collectionTime - b.collectionTime;});

              // the initial calculation
              if(intervalArray.intervals.length == 0){
                //the first sliced interval is empty - can happen very often
                if(slicedStates.length == 0)
                {
                  intervalArray.intervals.push(getIntervalSummary(slicedStates,intervalStart,intervalEnd,10,slidingWindowMinutes))

                }
                else{
                    intervalArray.intervals.push(getIntervalSummary(slicedStates,intervalStart,intervalEnd,states[0].idleTime,slidingWindowMinutes))

                }

              }
              //intervalArray has already some calculated intervals
              else{
                    //the first state is the last state of the previous interval : intervalArray.intervals[intervalArray.intervals.length-1].lastState
                    intervalArray.intervals.push(getIntervalSummary(slicedStates,intervalStart,intervalEnd, intervalArray.intervals[intervalArray.intervals.length-1].lastState, slidingWindowMinutes))

              }

                  intervalEnd = intervalEnd + intervalLength
                  intervalStart = intervalStart + intervalLength
            }


      }
      else{

        console.log('No States Today')
      }

    return intervalArray


  }
exports.getIdleStateDataPerLimit = function (req, res) {

    var userid = req.params.userid;
    // var deviceid=req.params.deviceid;
    var limit = parseInt(req.params.limit);
    var sort = parseInt(req.params.sort);

    var findquery={"userid":userid}
    if(req.params.deviceid)
    {
      findquery.deviceid  = req.params.deviceid
    }


    IdleState.find(findquery)
    .sort({_id:sort})
    .limit(limit)
    .exec(function (err, idlestatedata) {
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

exports.getIdleStateDataPerPeriod = function (req, res) {

    var userid=req.params.userid;
    // var deviceid=req.params.deviceid;
    var startdate=req.params.startdate;
    var enddate=req.params.enddate;

    var findquery={
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
