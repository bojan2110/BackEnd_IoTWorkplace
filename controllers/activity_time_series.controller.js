exports.getActivityData=function (req, res) {
  Steps = require('../models/step.model');
  var userid=req.params.userid;
  var startdate=req.params.startdate;
  var enddate=req.params.enddate;
  console.log(startdate)
  console.log(enddate)

  var findquery={
    "userid":userid ,
    "collectionTime": {"$lte":enddate,"$gte":startdate}
  }

  console.log('Querying the MongoDB with ',findquery)

  Steps.find(findquery,
  function (err, stepsdata) {
      if (err) {
        console.log('Error reading steps ',err)
          res.json({
              status: "error",
              message: err,
          });
      }
      else
      {
        if(stepsdata === 'undefined' || stepsdata.length == 0)
        {
          console.log('Stepsdata undefined ')
          res.json({
              status: "success",
              intervals:[],
              totalsteps:0,
              totalsits:0,
              lastupdate:0,
              cyclesinfo:{"prolonged":-1,
              "cycles":[],
              "current":{"length":-1,
              "start":-1}}
          });
        }
        //there is steps to show for the selected interval
        else
        {
          var intervals=[];
          var currentProlonged;
          //intervals are calculated only if the requested interval is daily data!
          if(enddate-startdate<=86400)
            {
              console.log('getting daily data')
              intervals=calculateIntervals(startdate,enddate,stepsdata);
              cyclesinfo=calculateCycles(startdate,enddate,stepsdata);
            }
          else
            {
              intervals=calculateHistory(startdate,enddate,stepsdata);
              console.log('getting history data')
            }




          // console.log('Reading the steps data ',stepsdata)
          var totalsteps=0
          var totalsits=0;


          for (stepentry in stepsdata){
              // console.log(stepentry)
              totalsteps+=stepsdata[stepentry].numSteps
              if(stepsdata[stepentry].sit!=-1)
                totalsits+=stepsdata[stepentry].sit
          }
          var lastUpdate=stepsdata.reduce((max, p) => p.collectionTime > max ? p.collectionTime : max, stepsdata[0].collectionTime);

          res.json({
              status: "success",
              intervals: intervals,
              totalsteps:totalsteps,
              totalsits:totalsits,
              lastupdate:lastUpdate,
              cyclesinfo:cyclesinfo
          });
        }

      }
  });
};

function calculateHistory(start,end,stepsdata) {
  var moment = require('moment');
  var from=moment.unix(start).startOf('day').unix();
  var until=moment.unix(end).endOf('day').unix();
  var to=from+86400;

  var intervalArray=[];
  // console.log('history from',from);
  // console.log('history to',to);

  while(from<=until)
  {

    // console.log('history from',from);
    // console.log('history to',to);
    var intervalData = stepsdata.filter(function (el) {
      return el.collectionTime < to &&
             el.collectionTime >= from;
    });
    var interval_steps=0;
    var interval_sits=0;
    for (steps in intervalData){
        interval_steps+=intervalData[steps].numSteps
        if(intervalData[steps].sit!=-1)
          interval_sits+=intervalData[steps].sit
    }

    intervalArray.push({
            "interval" : moment.unix(to-86400).format('YYYY-MM-DD'),
            "interval_steps"  : interval_steps,
            "interval_sits"  : interval_sits
        });

    //add another day
    from=from+86400;
    to=to+86400;
  }

  // console.log('intervalArray',intervalArray);
  return intervalArray;
}

function calculateIntervals(start,end,stepsdata) {

  var moment = require('moment');
  var intervalArray=[];
  //console.log('calculating intervals');
  //create the intervals for this day, first restart the day
  var day=moment.unix(start).startOf('day');
  //console.log('start of day',day);
  var count=0;
  from=day.unix();
  //make it a timestamp again, and create the ranges
  while(count<=23)
  {
    to=from+3600;

    var intervalData = stepsdata.filter(function (el) {
      return el.collectionTime < to &&
             el.collectionTime >= from;
    });
    var interval_steps=0;
    var interval_sits=0;
    for (steps in intervalData){
        interval_steps+=intervalData[steps].numSteps
        //it should never be -1 once we start calculating from start
        if(intervalData[steps].sit!=-1)
          interval_sits+=intervalData[steps].sit
    }

    // console.log('interval ',count)
    // console.log('from ',from)
    // console.log('to ',to)
    // console.log('interval_steps ',interval_steps)
    intervalArray.push({
            "interval" : count,
            "interval_steps"  : interval_steps,
            "interval_sits"  : interval_sits
        });

    from=to;
    count++;

}
  //console.log('intervalArray',intervalArray);
  return intervalArray;
}

function calculateCycles(start,end,data) {
  console.log('Calculating cycles')
  //the return returnArray
  var returnArray=[];
  //will store all the sitting cycles
  var cycles=[];
  //will store the current cycle
  var current=[];

  //start and end timestams of a cycle
  var cycleStartTs=0;
  var cycleEndTs=0;
  //total num of prolonged cycles
  var prolonged=0;
  //the condition for a prolonged cycle
  var prolongedMinutes=35;
  //minutes of the cycle + the current cycle minutes
  var minutesSitting=0
  var minutesCurrent=0

  //get the length of the data
  var count = Object.keys(data).length;
  //console.log('count dataobjects',count)
  //no data is available
  if(count==0)
  {
    //will return empty arrays
    returnArray.push({"prolonged":prolonged,
    "cycles":cycles,
    "current":current})
  }
  //single data point is available (this is posssible at the start of the day)
  else if (count==1)
  {
    if(data[entry].sits==1)
      current.push(
      {"lenght":1,
      "start":data[entry].collectionTime});

    //no cycles are done available,so only current cycle with one minute should be returned
    returnArray.push({"prolonged":prolonged,
    "cycles":cycles,
    "current":current})
  }
  //main calculation
  else{
    //console.log('entering main calculation')
    for (entry in data){
        //console.log('minutesSitting',minutesSitting)
        //user is sitting
        if(data[entry].sit==1)
        {
          //console.log('sitting minute')
          minutesSitting+=1;
          minutesCurrent+=1;
        }
        //log the start of the cycle
        if(minutesSitting==1)
          cycleStartTs=data[entry].collectionTime

        //user is standing == cycle break
        if(data[entry].sit==0)
        {
          //console.log('standing minute')
          //check prologned
          if(minutesSitting>=prolongedMinutes)
            prolonged+=1;

          if(minutesSitting>0)
          {
              cycleEndTs=data[entry].collectionTime;
              cycles.push({
              "startCycle":cycleStartTs,
              "endCycle":cycleEndTs,
              "totalTime":minutesSitting});
          }

          //resets
          minutesCurrent=0;
          minutesSitting=0;
          cycleStartTs=0;

        }//end cycle break

    }
    //after all data is looped, you will get a current cycle info here
    current.push(
    {"length":minutesCurrent,
    "start":cycleStartTs})
    //fill the return array
    returnArray.push({"prolonged":prolonged,
    "cycles":cycles,
    "current":current})


  }
console.log('returnArray',returnArray)
return returnArray;

}
