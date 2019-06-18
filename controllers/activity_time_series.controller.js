exports.testSteps=function (req, res) {
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
        if ( stepsdata === 'undefined' || stepsdata.length == 0)
        {
          console.log('Stepsdata undefined ')
          res.json({
              status: "success",
              intervals:[],
              totalsteps:0,
              lastupdate:0
          });
        }
        //there is steps to show for the selected interval
        else
        {
          var intervals=[];
          //intervals are calculated only if the requested interval is daily data!
          if(enddate-startdate<=86400)
            intervals=calculateIntervals(startdate,enddate,stepsdata);
          else
            intervals=calculateHistory(startdate,enddate,stepsdata);




          console.log('Reading the steps data ',stepsdata)
          var totalsteps=0



          for (stepentry in stepsdata){

              console.log(stepentry)
              totalsteps+=stepsdata[stepentry].numSteps
          }
          var lastUpdate=stepsdata.reduce((max, p) => p.collectionTime > max ? p.collectionTime : max, stepsdata[0].collectionTime);

          res.json({
              status: "success",
              intervals: intervals,
              totalsteps:totalsteps,
              lastupdate:lastUpdate
          });
        }



      }
  });
};

function calculateHistory(start,end,stepsdata) {
  var moment = require('moment');
  var from=moment.unix(start).startOf('day').unix();
  var to=moment.unix(start).endOf('day').unix();
  var daydiff=to-from/86400;
  var intervalArray=[];
  console.log('history from',from);
  console.log('history to',to);
  console.log('day diff',daydiff);

  while(to<end)
  {
    to=from+86400;
    var intervalData = stepsdata.filter(function (el) {
      return el.collectionTime < to &&
             el.collectionTime >= from;
    });
    var interval_steps=0;
    for (steps in intervalData){
        interval_steps+=intervalData[steps].numSteps
    }

    intervalArray.push({
            "interval" : moment.unix(to-86400),
            "interval_steps"  : interval_steps
        });


    daydiff--;
  }

  return [];


}

function calculateIntervals(start,end,stepsdata) {

  var moment = require('moment');
  var intervalArray=[];
  console.log('calculating intervals');
  //create the intervals for this day, first restart the day
  var day=moment.unix(start).startOf('day');
  console.log('start of day',day);
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
    for (steps in intervalData){
        interval_steps+=intervalData[steps].numSteps
    }

    console.log('interval ',count)
    console.log('from ',from)
    console.log('to ',to)
    console.log('interval_steps ',interval_steps)
    intervalArray.push({
            "interval" : count,
            "interval_steps"  : interval_steps
        });

    from=to;
    count++;

}
  console.log('intervalArray',intervalArray);
  return intervalArray;
}


exports.getActivityTimeSeries = function (req, res) {

  var userid=req.params.userid;
  var activity=req.params.activity;
  var startdate=req.params.startdate.toString();
  var enddate=req.params.enddate.toString();
  console.log(startdate);
  console.log(enddate);

  var findquery={
    "userid":userid ,
    "date": {"$gte": startdate,"$lte":enddate}
  }

 console.log(findquery);  //get one day data - per hour

  if (startdate ===  enddate){
    if(activity === "steps"){
        Steps = require('../models/steps.model');
        Steps.find(findquery,
        function (err, stepsdata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else{
                console.log(stepsdata)
                var totalSteps=parseInt(stepsdata[0].steps/8)
                var jsonArr = [];
                for (var i=0;i<=23;i++)
                {
                    var num=(Math.random()*2+0).toFixed(1);
                    if([0,1,2, 3, 4,5,6,7,19,20,21,22,23].includes(i))
                        num=0
                    jsonArr.push({
                        startinterval: i,
                        endinterval: i+1,
                        steps: parseInt(num*totalSteps)
                    });
                }
                res.json({
                    status: "success",
                    total_steps: stepsdata[0].steps,
                    num: jsonArr
                });
            }
        });
    }
      else if(activity === "sit"){
        Sit = require('../models/sittingevent.model');
        Sit.find(findquery,
        function (err, sitdata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else{
                var totalSit=parseInt(sitdata[0].sit/8)

                var jsonArr = [];

                for (var i=0;i<=23;i++)
                {
                    var num=(Math.random()*2+0).toFixed(1);
                    if([0,1,2, 3, 4,5,6,7,19,20,21,22,23].includes(i))
                        num=0
                    jsonArr.push({
                        startinterval: i,
                        endinterval: i+1,
                        sit: parseInt(num*totalSit)
                    });
                }

                res.json({
                    status: "success",
                    total_sit: sitdata[0].sit,
                    num: jsonArr
                });
            }
        });
      }
      else if(activity === "cycles"){
        SitCycle = require('../models/sitcycle.model');
        SitCycle.find(findquery,
        function (err, cycledata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else{
                //get the number of cycles
                var numCycles=cycledata[0].cycles

                var countCycles=0;
                var jsonArr = [];

                for (var i=0;i<=23;i++)
                {
                  //will generate 1 or 0
                    var cycleOrNo=(Math.random()>0.5)? 1 : 0;

                    if([0,1,2, 3, 4,5,6,7,19,20,21,22,23].includes(i))
                        cycleOrNo=0

                    if(cycleOrNo==1)
                      countCycles=countCycles+1

                    console.log(cycleOrNo);
                    console.log(countCycles);
                    console.log(numCycles);

                    if(countCycles>numCycles)
                      cycleOrNo=0

                    jsonArr.push({
                        startinterval: i,
                        endinterval: i+1,
                        cycle: parseInt(cycleOrNo)
                    });

                }

                res.json({
                    status: "success",
                    total_cycles: cycledata[0].sit,
                    num: jsonArr
                });

            }
        });
      }
  }
  //get history data - per day
  else{
    if(activity === "steps"){
        Steps = require('../models/steps.model');
        Steps.find(findquery,
        function (err, stepsdata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else{
                var totalSteps=0
                for (var i = 0; i < stepsdata.length; i++) {  //loop through the array
                    console.log(stepsdata[i]);
                    totalSteps += stepsdata[i].steps;  //Do the math!
                }

                res.json({
                    status: "success",
                    total_steps: totalSteps,
                    returnArray: stepsdata
                });
            }
        });
    }//end activity Steps
    else if(activity === "sit"){
      Sit = require('../models/sittingevent.model');
      Sit.find(findquery,
      function (err, sitdata) {
          if (err) {
              res.json({
                  status: "error",
                  message: err,
              });
          }
          else{
              var totalSit=0
              for (var i = 0; i < sitdata.length; i++) {  //loop through the array
                  console.log(sitdata[i]);
                  totalSit += sitdata[i].sit;  //Do the math!
              }
              res.json({
                  status: "success",
                  total_sit: totalSit,
                  returnArray: sitdata
              });
          }
      });
    }//end activity sitting
    else if(activity === "cycles"){
        SitCycle = require('../models/sitcycle.model');
        SitCycle.find(findquery,
        function (err, cycledata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            else{
                var totalCycles=0
                for (var i = 0; i < cycledata.length; i++) {  //loop through the array
                    console.log(cycledata[i]);
                    totalCycles += cycledata[i].sit;  //Do the math!
                }
                res.json({
                    status: "success",
                    total_sit: totalCycles,
                    returnArray: cycledata
                });
            }
        });
    }//end activity cycles
  }

  };
