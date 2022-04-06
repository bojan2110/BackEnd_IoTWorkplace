IdleState = require('../models/idlestate.model');

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
function getInferredCycles(intervalArray){
  var cycleArray = {
      cycles: []
  };
  // X minutes in row need to have a state of 0 so that a siting cycle is breaked
  var idleCycleMinuteThreshold = 2
  // cycle timestamps
  var cycle_begin = 0
  var cycle_end = 0
  // -1 initial, 0 - not in front of computer, 1 -  in front of computer
  var sittingCycle = -1

  var cycleActiveMinutes = 0
  var cycleInactiveMinutes = 0
  var cycleComputerOff = 0

  //tracking the state progress while looping
  var lastState = -2
  var currentState = -2

  var intCounter  = 0
  var lastEndInterval = 0
  var lastIntCounter = 0

  for(var i = 0; i < intervalArray.length; i++) {

      intCounter = intCounter + 1
      //take the new state
      currentState = intervalArray[i]['electronState']

      //checks if there are conditions for creating a cycle
      if(lastState!=currentState & lastState!=-2){

        //'ignore' creating an idle cycle (transition from 0 to 1) in case less than 2 minutes
        // in this case just increase the number of active minutes
        if(lastState == 0 & currentState == 1 & (intCounter - lastIntCounter)<2){
              // console.log('here with ', intervalArray[i]['interval_begin'], intervalArray[i]['interval_end'])
              cycleActiveMinutes = cycleActiveMinutes + 1
              cycleInactiveMinutes = 0
              cycleComputerOff = 0
        }
        else{
          //two of these will be 0
          // console.log('"cycle_begin" : cycle_begin, "cycle_end" : cycle_end', moment.unix(cycle_begin).format("HH:mm:ss"), moment.unix(cycle_end).format("HH:mm:ss"))
          var length = cycleInactiveMinutes + cycleActiveMinutes + cycleComputerOff
          // console.log('cycleInactiveMinutes + cycleActiveMinutes + cycleComputerOff',cycleInactiveMinutes, cycleActiveMinutes, cycleComputerOff,length)


          //is the cycle 'prolonged' (For now the threshold is 45 minutes)
          var prolonged
          if(length >= 45)
            prolonged = 1
          else
            prolonged = 0


          cycleArray.cycles.push({"cycle_begin" : cycle_begin, "cycle_end" :cycle_end, "cycleType" : sittingCycle, "cycle_length" : length, "prolonged" : prolonged })

          //reset the cycle settings
          cycleActiveMinutes = 0
          cycleInactiveMinutes = 0
          cycleComputerOff = 0

          lastIntCounter = intCounter
          //this is used for the calculation of the last unchanged interval
          lastEndInterval = cycle_end
        }
      }

      //cycle begins only at the start of the counting minutes of the cycle
      if(cycleActiveMinutes == 0 & cycleInactiveMinutes == 0 & cycleComputerOff == 0)
      {
          cycle_begin = intervalArray[i]['interval_begin']
          cycle_end = intervalArray[i]['interval_end']
      }
      else{
        cycle_end = intervalArray[i]['interval_end']
      }

      if(currentState == 1)
      {
          cycleActiveMinutes = cycleActiveMinutes + 1
          cycleInactiveMinutes = 0
          cycleComputerOff = 0
          sittingCycle = 1
          lastState = 1
      }
      else if (currentState == 0)
      {
          cycleInactiveMinutes = cycleInactiveMinutes + 1
          cycleActiveMinutes = 0
          cycleComputerOff = 0
          sittingCycle = 0
          lastState = 0
      }
      else if (currentState == -1)
      {
        cycleComputerOff = cycleComputerOff + 1
        cycleActiveMinutes = 0
        cycleInactiveMinutes = 0
        sittingCycle = -1
        lastState = -1
      }
  }

  //the  last current cycle
  var lastCycle = intervalArray.filter(function (el) { return el.interval_begin >= lastEndInterval});
  var cycle_sit_stand =   lastCycle.reduce(function (sum, lastCycle) { return sum + lastCycle.inferredState;}, 0);

  if(cycle_sit_stand!=0)
    sittingCycle = 1
  else
    sittingCycle = 0

  cycle_length = lastCycle.length

  if(cycle_length>=45)
    prolonged = 1
  else
    prolonged = 0

  cycle_begin = lastCycle[0]['interval_begin']
  cycle_end = lastCycle[lastCycle.length-1]['interval_end']
  // console.log('getInferredCycles lastCycle', lastCycle,cycle_begin,cycle_end,cycle_length)

  cycleArray.cycles.push({"cycle_begin" : cycle_begin, "cycle_end" :cycle_end, "cycleType":sittingCycle, "cycle_length": cycle_length,"prolonged" : prolonged})

  return cycleArray
}
// help method for getInferredCycles
function glueCycles(cycleArray){
    var returnArray = cycleArray

    var cycleType = returnArray[0]['cycleType']
    var cycleLength = returnArray[0]['cycle_length']
    var cycleBegin = returnArray[0]['cycle_begin']
    var cycleEnd = returnArray[0]['cycle_end']
    var cycleProlonged = returnArray[0]['prolonged']

    var cycleNewBegin
    var newArray = []
    var glued = false

    for(var i = 1; i < returnArray.length; i++) {

      if(returnArray[i]['cycle_length'] == 1)
      {
        cycleEnd = returnArray[i]['cycle_end']
        cycleLength = cycleLength + 1
      }
      //maybe this is too much?
      else if(returnArray[i]['cycle_length'] == 2)
      {
        cycleEnd = returnArray[i]['cycle_end']
        cycleLength = cycleLength + 2
      }
      else{
         newArray.push({"cycle_begin" : cycleBegin, "cycle_end" :cycleEnd, "cycleType":cycleType, "cycle_length": cycleLength,"prolonged" : cycleProlonged})
         cycleType = returnArray[i]['cycleType']
         cycleLength = returnArray[i]['cycle_length']
         cycleBegin = returnArray[i]['cycle_begin']
         cycleEnd = returnArray[i]['cycle_end']
         cycleProlonged = returnArray[i]['prolonged']
      }
    }
    newArray.push({"cycle_begin" : returnArray[returnArray.length-1]['cycle_begin'], "cycle_end" :returnArray[returnArray.length-1]['cycle_end'], "cycleType":returnArray[returnArray.length-1]['cycleType'], "cycle_length": returnArray[returnArray.length-1]['cycle_length'],"prolonged" : returnArray[returnArray.length-1]['prolonged']})
    //EXTRA FIXES

      //loop through the new array and fix the long long breaks
      for(var i = 0; i < newArray.length; i++) {
        if(newArray[i]['cycleType'] == 0 && newArray[i]['cycle_length'] >= 60 )
        {
          newArray[i]['cycleType'] = -1
        }
        //case for the wrong computer off settings
        if(newArray[i]['cycleType'] == -1 && newArray[i]['cycle_length'] < 60 )
        {
          newArray[i]['cycleType'] = 0
        }
      }

     cycleType = newArray[0]['cycleType']
     cycleLength = newArray[0]['cycle_length']
     cycleBegin = newArray[0]['cycle_begin']
     cycleEnd = newArray[0]['cycle_end']
     cycleProlonged = newArray[0]['prolonged']

     var newArray2 = []
     var createdLastCycle = false
    //loop to glue consecutive cycles
      for(var i = 1; i < newArray.length; i++) {
        if(newArray[i]['cycleType'] == 0 && cycleType == -1){
          cycleEnd = newArray[i]['cycle_end']
          cycleLength = cycleLength + newArray[i]['cycle_length']
          createdLastCycle = false
        }
        else if(newArray[i]['cycleType'] == -1 && cycleType == 0){
          cycleType = -1
          cycleEnd = newArray[i]['cycle_end']
          cycleLength = cycleLength + newArray[i]['cycle_length']
          createdLastCycle = false
        }
        else if(newArray[i]['cycleType'] == cycleType){
          cycleEnd = newArray[i]['cycle_end']
          cycleLength = cycleLength + newArray[i]['cycle_length']
          createdLastCycle = false
        }
        else{
          newArray2.push({"cycle_begin" : cycleBegin, "cycle_end" :cycleEnd, "cycleType":cycleType, "cycle_length": cycleLength,"prolonged" : cycleProlonged})
          cycleType = newArray[i]['cycleType']
          cycleLength = newArray[i]['cycle_length']
          cycleBegin = newArray[i]['cycle_begin']
          cycleEnd = newArray[i]['cycle_end']
          cycleProlonged = newArray[i]['prolonged']
          createdLastCycle = true
        }
      }
    // we are at the end of the cycle and the last glued has not been inserted? - then insert it
    newArray2.push({"cycle_begin" : cycleBegin, "cycle_end" :cycleEnd, "cycleType":cycleType, "cycle_length": cycleLength,"prolonged" : cycleProlonged})

    //again check in case the glueing get a long break, or unflaged prolonged cycle
    for(var i = 0; i < newArray2.length; i++) {
      if(newArray2[i]['cycleType'] == 0 && newArray2[i]['cycle_length'] >= 60 )
      {
        newArray2[i]['cycleType'] = -1
      }

      if(newArray2[i]['cycleType'] == -1 && newArray2[i]['cycle_length'] < 60 )
      {
        newArray2[i]['cycleType'] = 0
      }
      if(newArray2[i]['cycle_length'] >= 45)
      {
        newArray2[i]['prolonged'] = 1
      }
    }

   cycleType = newArray2[0]['cycleType']
   cycleLength = newArray2[0]['cycle_length']
   cycleBegin = newArray2[0]['cycle_begin']
   cycleEnd = newArray2[0]['cycle_end']
   cycleProlonged = newArray2[0]['prolonged']

    var newArray3 = []
    var createdLastCycle = false
   //loop to glue consecutive cycles
     for(var i = 1; i < newArray2.length; i++) {
       if(newArray2[i]['cycleType'] == cycleType){
         cycleEnd = newArray2[i]['cycle_end']
         cycleLength = cycleLength + newArray2[i]['cycle_length']
         createdLastCycle = false
       }
       else{
         newArray3.push({"cycle_begin" : cycleBegin, "cycle_end" :cycleEnd, "cycleType":cycleType, "cycle_length": cycleLength,"prolonged" : cycleProlonged})
         cycleType = newArray2[i]['cycleType']
         cycleLength = newArray2[i]['cycle_length']
         cycleBegin = newArray2[i]['cycle_begin']
         cycleEnd = newArray2[i]['cycle_end']
         cycleProlonged = newArray2[i]['prolonged']
         createdLastCycle = true
       }
     }
     newArray3.push({"cycle_begin" : cycleBegin, "cycle_end" :cycleEnd, "cycleType":cycleType, "cycle_length": cycleLength,"prolonged" : cycleProlonged})


    return newArray3
}
//help method for createIntervals
function getIntervalSummary(states,start_interval,end_interval,lastState,slidingWindowMinutes){
    var idleIntervalThreshold = 0.3
  // console.log('getIntervalSummary function')
    var currentState = lastState

    var startInterval = start_interval
    var endInterval = end_interval
    //recreating idle timeline
    // total active computer usage time
    var activeUserTime = 0
    //total nonactive computer usage time
    var notactiveUserTime = 0
    //total other nonactive
    var otherNonActive = 0

    var iLength = 0
    var computerTimeON = 0
    var computerTimeOFF = 0

    var totalStates = 0

    //empty interval - in this case only take the last state and add the whole interval length to it
    if(states.length == 0)
    {
      iLength = slidingWindowMinutes*60

      if(currentState == 1)
      {
          activeUserTime = activeUserTime + iLength
          computerTimeON = computerTimeON + iLength
      }
      else if(currentState == 0)
      {
          notactiveUserTime = notactiveUserTime + iLength
          computerTimeON = computerTimeON + iLength
      }
      else if(currentState == 10)
        {
          computerTimeOFF = computerTimeOFF + iLength
        }
      else
        {
          otherNonActive = otherNonActive + iLength
          computerTimeOFF = computerTimeOFF + iLength
        }
    }
    //in case there are states with actual values in the states array
    else {
          totalStates = states.length
          // console.log('total data intervals', totalStates)

          for (i=0,l=states.length; i<l; i++){
              // console.log('Step:', i)
              // console.log('current state', currentState)
              // console.log('next state', intervals[i].idleTime)


              // dont we get an empty length in case startInterval -- states[0].collectionTime in the first step?
              endInterval = states[i].collectionTime
              iLength = endInterval - startInterval
              // console.log('length', intervalLength)

              if(currentState == 1)
              {
                  activeUserTime = activeUserTime + iLength
                  computerTimeON = computerTimeON + iLength
              }
              else if(currentState == 0)
                {
                  notactiveUserTime = notactiveUserTime + iLength
                  computerTimeON = computerTimeON + iLength
                }
              else if(currentState == 10)
                {
                  computerTimeOFF = computerTimeOFF + iLength
                }
              else
                {
                  otherNonActive = otherNonActive + iLength
                  computerTimeOFF = computerTimeOFF + iLength
                }

              startInterval = endInterval
              currentState = states[i].idleTime
          }

          //for the last point - 'current state'
          iLength = end_interval - startInterval
          // console.log('length', intervalLength)

          if(currentState == 1)
          {
              activeUserTime = activeUserTime + iLength
              computerTimeON = computerTimeON + iLength
          }
          else if(currentState == 0)
          {
              notactiveUserTime = notactiveUserTime + iLength
              computerTimeON = computerTimeON + iLength
          }
          else if(currentState == 10)
          {
              computerTimeOFF = computerTimeOFF + iLength
          }
          else
          {
              otherNonActive = otherNonActive + iLength
              computerTimeOFF = computerTimeOFF + iLength
          }
    }




  // inferredState  0 idle (off screen), 1 active (on screen)

  var inferredState = 0
  var electronState = -1
  // this means that this is a minute when the computer was turned on/off
  //this logic is limited to a slidingWindowMinutes = 1

  if(computerTimeOFF == 60)
  {
        inferredState = 0
        electronState = -1
  }
  else if(activeUserTime/notactiveUserTime < idleIntervalThreshold)
  {
        inferredState = 0
        electronState = 0
  }
  else
  {
        inferredState = 1
        electronState = 1
  }


  return {"interval_begin" : start_interval, "interval_end" : end_interval,
                                     "activeUserTime":activeUserTime,"notactiveUserTime":notactiveUserTime,"inferredState":inferredState,"otherNonActive":otherNonActive,
                                     "computerTimeON":computerTimeON,"computerTimeOFF":computerTimeOFF,"states":states,"statesLength":totalStates,"lastState":currentState, "electronState": electronState}

}
//summary of states per period - used in the plots
function statesSummaryPerPeriod(intervals,intervalLength){  // output data
  var computerOff = []
  var screenTimeOn =[]
  var screenTimeOff = []
  var otherNonActive = []
  var cycleArray = {
      cycles: []
  };
  // console.log('statesSummaryPerPeriod intervals',intervals)
  var dataEnd = intervals[intervals.length-1]['interval_end']
  var hour = 0

  if(intervals.length!=0)
  {

    intervalStart = intervals[0]['interval_begin']
    intervalEnd = intervalStart + intervalLength

    while(intervalStart<dataEnd){

        var subsetInterval = intervals.filter(function (el) { return el.interval_begin >= intervalStart && el.interval_end < intervalEnd });
        // console.log('statesSummaryPerPeriod subsetInterval',subsetInterval)
        // summaries go here
        computerOff.push(subsetInterval.reduce(function (sum, subsetInterval) { return sum + subsetInterval.computerTimeOFF;}, 0))
        screenTimeOn.push(subsetInterval.reduce(function (sum, subsetInterval) { return sum + subsetInterval.activeUserTime;}, 0))
        screenTimeOff.push(subsetInterval.reduce(function (sum, subsetInterval) { return sum + subsetInterval.notactiveUserTime;}, 0))
        otherNonActive.push(subsetInterval.reduce(function (sum, subsetInterval) { return sum + subsetInterval.otherNonActive;}, 0))

        //CYCLE Calculation within this interval
        //tracking the state progress while looping
        var lastState = -1
        var currentState = -1
        //take the first element
        var cycleLength = 1
        var wasPushed = 0

        var prolonged = -1

        var true_prolonged = -1
        lastState = subsetInterval[0]['electronState']
        cycle_begin = subsetInterval[0]['interval_begin']
        cycle_end = subsetInterval[0]['interval_end']
        true_prolonged = subsetInterval[0]['true_prolonged']
        true_length = subsetInterval[0]['true_length']

        for(var i = 1; i < subsetInterval.length; i++) {
            currentState = subsetInterval[i]['electronState']
            true_prolonged = subsetInterval[i-1]['true_prolonged']
            true_length = subsetInterval[i-1]['true_length']

            if(currentState == lastState)
            {
              cycleLength = cycleLength + 1
              cycle_end = subsetInterval[i]['interval_end']
            }
            //record cycle
            else{
              if(cycleLength>=45)
                prolonged = 1
              else
                prolonged = 0

              cycleArray.cycles.push({"hour" : hour,"cycle_begin" : cycle_begin, "cycle_end" : cycle_end, "cycleType":lastState, "cycle_length": cycleLength, "prolonged": prolonged, "true_prolonged": true_prolonged, "true_length" : true_length })
              wasPushed = 1
              cycle_begin = cycle_end + 1
              lastState = currentState
              cycleLength = 1
            }

        }

        if(currentState == lastState)
        {
          if(cycleLength>=45)
            prolonged = 1
          else
            prolonged = 0
          cycleArray.cycles.push({"hour" : hour,"cycle_begin" : cycle_begin, "cycle_end" : cycle_end, "cycleType":lastState, "cycle_length": cycleLength,"prolonged": prolonged, "true_prolonged": true_prolonged , "true_length" : true_length  })
          wasPushed = 1
        }
        // looped the whole cycle and there was no change in state, just push the whole cycle
        if(wasPushed == 0)
        {
          if(cycleLength>=45)
            prolonged = 1
          else
            prolonged = 0
          cycleArray.cycles.push({"hour" : hour,"cycle_begin" : cycle_begin, "cycle_end" : cycle_end, "cycleType":lastState, "cycle_length": cycleLength,"prolonged": prolonged, "true_prolonged": true_prolonged, "true_length" : true_length   })
        }

        intervalStart = intervalEnd
        intervalEnd = intervalStart + intervalLength
        hour = hour + 1
    }// ending the subinterval calculations (while cycle)


      computerOff = computerOff.map(function(element){return Math.round(element/60);});
      screenTimeOff = screenTimeOff.map(function(element){return Math.round(element/60);});
      screenTimeOn = screenTimeOn.map(function(element){return Math.round(element/60);});
      //remove the final cycle as it is a duplicate - seems like this duplicate thingy is not
      // cycleArray.cycles.splice(-1,1);
  }

  return [computerOff,screenTimeOn,screenTimeOff,otherNonActive,cycleArray]
}

//takes the DB-saved states and returns inferred intervals (with size depending on the sliding window)
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


function createMinuteArray(cycleArray){
  var minuteArray = []
  var cycleBegin
  var cycleType
  var cycleLength
  var cycleProlonged

  var computerTimeOFF = 0
  var activeUserTime = 0
  var notactiveUserTime = 0
  var otherNonActive = 0

  for(var i = 0; i < cycleArray.length; i++) {
     cycleBegin = cycleArray[i]['cycle_begin']
     cycleType = cycleArray[i]['cycleType']
     cycleLength = cycleArray[i]['cycle_length']
     cycleProlonged = cycleArray[i]['prolonged']

     if(cycleType!=1)
      cycleProlonged = 0

     for(j =0; j<cycleLength; j++){

         if(cycleType == -1){
           computerTimeOFF = 60
         }
         else if(cycleType == 0){
           notactiveUserTime = 60
         }
         else if(cycleType == 1){
           activeUserTime = 60
         }

        minuteArray.push({"interval_begin" : cycleBegin, "interval_end" : cycleBegin+59, "electronState":cycleType,"computerTimeOFF" :computerTimeOFF,"activeUserTime":activeUserTime,"notactiveUserTime":notactiveUserTime,"otherNonActive":otherNonActive,"true_prolonged":cycleProlonged,"true_length":cycleLength })
        computerTimeOFF = 0
        activeUserTime = 0
        notactiveUserTime = 0
        cycleBegin = cycleBegin + 60
     }
  }
    return minuteArray

}


function hourTimeline(cycleArray){
  var hourlyArray = []
  var intervalLength = 3600
  var hour = 0
  var startDay
  var endDay = cycleArray[cycleArray.length-1]['cycle_end']
  console.log('hourTimeline cycleArray ',cycleArray)
  if(cycleArray.length != 0)
  {
      intervalStart = cycleArray[0]['cycle_begin']
      intervalEnd = intervalStart + intervalLength - 1

      while(intervalStart<endDay){
        var subsetInterval = cycleArray.filter(function (el){return el.cycle_begin >= intervalStart});
        console.log('hourTimeline subsetInterval',intervalStart,intervalEnd, subsetInterval)
        //stay within the subsetInterval
        if(subsetInterval.length > 0)
        {
          subsetInterval = cycleArray.filter(function (el){return el.cycle_begin >= intervalStart && el.cycle_end >= intervalEnd})[0];
          console.log('hourTimeline subsetInterval',intervalStart,intervalEnd, subsetInterval)

        }

        hourlyArray.push({"hour" : hour,"cycle_begin" : intervalStart, "cycle_end" : intervalEnd, "cycleType" :subsetInterval['cycleType'],  "subsetInterval" : subsetInterval})
        intervalStart = intervalEnd
        intervalEnd = intervalStart + intervalLength - 1
        hour = hour + 1
      }
    }

  return hourlyArray
}

async function cyclesStatsWeekComparison(){
  //this vs last week
  //This week
  var startDate1  = moment(moment().startOf('isoWeek').format('YYYY-MM-DD')).unix();
  var endDate1 = moment().unix();

  var startDate2 = moment().startOf('isoWeek').subtract(1, 'week').startOf('day').unix()
  var endDate2 = moment(moment().startOf('isoWeek').format('YYYY-MM-DD')).unix() - 1

  //
  var query1 = 'https://health-iot.labs.vu.nl/api/idlestate/user/'+localStorage.email+'/device/startdate/' + startDate1 + '/enddate/' + endDate1
  let states1 = await getScreenTrackerDataPeriod(query1)
  console.log('cyclesStatsWeekComparison query1,states1',query1,states1)

  query2 = 'https://health-iot.labs.vu.nl/api/idlestate/user/'+localStorage.email+'/device/startdate/' + startDate2 + '/enddate/' + endDate2
  let states2 = await getScreenTrackerDataPeriod(query2)
  console.log('cyclesStatsWeekComparison query2,states2',query2,states2)


  if(states1.length == 0){
    return []
  }
  else if(states2.length == 0){
    return []
  }
  else{

    var intervalArray1 = createIntervals(states1,1,parseInt(query1.slice(-29,-19)),parseInt(query1.slice(-10)))
    var inferredCycles1 = getInferredCycles(intervalArray1.intervals).cycles
    var gluedCycles1 = glueCycles(inferredCycles1)
    console.log('cyclesStatsWeekComparison glueCycles this week',gluedCycles1)
    var minuteArray1 = createMinuteArray(gluedCycles1)
    var summaryData1 = statesSummaryPerPeriod(minuteArray1,60*60*24)
    var cyclesData1 = summaryData1[4].cycles
    var filteredWeekData1 = []

    var intervalArray2 = createIntervals(states2,1,parseInt(query2.slice(-29,-19)),parseInt(query2.slice(-10)))
    var inferredCycles2 = getInferredCycles(intervalArray2.intervals).cycles
    var gluedCycles2 = glueCycles(inferredCycles2)
    console.log('cyclesStatsWeekComparison glueCycles last week',gluedCycles2)
    var minuteArray2 = createMinuteArray(gluedCycles2)
    var summaryData2 = statesSummaryPerPeriod(minuteArray2,60*60*24)
    var cyclesData2 = summaryData2[4].cycles
    var filteredWeekData2 = []



    var dayMapArray = [localStorage.mondayController,localStorage.tuesdayController,localStorage.wednesdayController,localStorage.thursdayController, localStorage.fridayController, localStorage.saturdayController, localStorage.sundayController]
    console.log('summaryData1,summaryData2',summaryData1,summaryData2)
    console.log('cyclesData1,cyclesData2',cyclesData1,cyclesData2)
    var activeDaysWeek1 = 0
    var activeDaysWeek2 = 0

    for(i = 0; i<dayMapArray.length;i++){
      if(dayMapArray[i]=="1")
      {
        filteredWeekData1.push.apply(filteredWeekData1,cyclesData1.filter(a => a.hour == i))
        filteredWeekData2.push.apply(filteredWeekData2,cyclesData2.filter(a => a.hour == i))

        if(cyclesData1.filter(a => a.hour == i).length!=0)
        {
          activeDaysWeek1 = activeDaysWeek1 + 1
        }

        if(cyclesData2.filter(a => a.hour == i).length!=0)
        {
          activeDaysWeek2 = activeDaysWeek2 + 1
        }
      }
    }
    //add prolonged info to these arrays
    console.log('filteredWeekData1,filteredWeekData2,activeDaysWeek1,activeDaysWeek2',filteredWeekData1,filteredWeekData2,activeDaysWeek1,activeDaysWeek2)

    // const dates1 = states1.map(function (state, index, array) {return moment(state.createdAt).format('DD-MM-YYYY');});
    // const dates2 = states2.map(function (state, index, array) {return moment(state.createdAt).format('DD-MM-YYYY');});
    // stats1 = cyclesStatsDaily(gluedCycles1,[...new Set(dates1)].length)
    // stats2 = cyclesStatsDaily(gluedCycles2,[...new Set(dates2)].length)

    stats1 = cyclesStatsDaily(filteredWeekData1,activeDaysWeek1)
    stats2 = cyclesStatsDaily(filteredWeekData2,activeDaysWeek2)
  }

  return [stats1,stats2]
}
// internal (system) methods or we also allow user interaction?
async function cyclesDayVsDay(){
  //make two API calls to get the neccessary data
  //DAY 1 - today
  var startDate1 = moment().startOf('day').unix()
  var endDate1 =  moment().unix()
  //day 2 - either yesterday or the same day last week
  var startDate2
  var endDate2

  //same day last week
  startDate2 = moment().subtract(1, 'week').startOf('day').unix()
  endDate2 = startDate2 + 86399


  var query1 = 'https://health-iot.labs.vu.nl/api/idlestate/user/'+localStorage.email+'/device/startdate/' + startDate1 + '/enddate/' + endDate1
  let states1 = await getScreenTrackerDataDaily(query1)

  query2 = 'https://health-iot.labs.vu.nl/api/idlestate/user/'+localStorage.email+'/device/startdate/' + startDate2 + '/enddate/' + endDate2
  let states2 = await getScreenTrackerDataDaily(query2)
  console.log('cyclesDayVsDay states2', query2, states2)
  console.log('cyclesDayVsDay states1', query1,states1)

  // no data available for today
  if(states1.length == 0){
    return []
  }
  //no last week data available ! - modify this logic
  else if(states2.length == 0){
    var intervalArray1 = createIntervals(states1,1,parseInt(query1.slice(-29,-19)),parseInt(query1.slice(-10)))
    var inferredCycles1 = getInferredCycles(intervalArray1.intervals).cycles
    var gluedCycles1 = glueCycles(inferredCycles1)
    stats1 = cyclesStatsDaily(gluedCycles1,1)
    stats2 = cyclesStatsDaily([],1)
  }
  else{
    var intervalArray1 = createIntervals(states1,1,parseInt(query1.slice(-29,-19)),parseInt(query1.slice(-10)))
    var inferredCycles1 = getInferredCycles(intervalArray1.intervals).cycles
    var gluedCycles1 = glueCycles(inferredCycles1)


    var intervalArray2 = createIntervals(states2,1,parseInt(query2.slice(-29,-19)),parseInt(query2.slice(-10)))
    var inferredCycles2 = getInferredCycles(intervalArray2.intervals).cycles
    var gluedCycles2 = glueCycles(inferredCycles2)

    stats1 = cyclesStatsDaily(gluedCycles1,1)
    stats2 = cyclesStatsDaily(gluedCycles2,1)
  }


  return [stats1,stats2]

}


function cyclesStatsDaily(cycleArray,unique_days){

  var statsArray = {}

  if(cycleArray.length !=0){
    var activeCycles = cycleArray.filter(function(s) {return s.cycleType === 1});
    var activeProlongedCycles = activeCycles.filter(function(s) {return s.prolonged === 1});

    var idleCycles = cycleArray.filter(function(s) {return s.cycleType === 0});
    var offCycles = cycleArray.filter(function(s) {return s.cycleType === -1});

    //BREAK STATS
    //idleCycles contain the breaks information, each element its a break
    var numBreaks = idleCycles.length
    var totalBreakLength = idleCycles.reduce(function (sum, idleCycles) {return sum + idleCycles.cycle_length;},0)
    var avgBreakLength = Math.round(totalBreakLength/numBreaks);
    //this is needed for the weekly stats - to make them 'per day'
    totalBreakLength = Math.round(totalBreakLength/unique_days)
    numBreaks = Math.round(numBreaks/unique_days)

    var longestBreak = idleCycles.reduce((acc, cycle) => acc = acc > cycle.cycle_length ? acc : cycle.cycle_length, 0);
    // console.log('numBreaks,totalBreakLength,avgBreakLength,longestBreak',numBreaks,totalBreakLength,avgBreakLength,longestBreak)

    //COMPUTER TIME STATS
    var numProlonged = activeProlongedCycles.length
    var totalProlongedLength = activeProlongedCycles.reduce(function (sum, activeProlongedCycle) {return sum + activeProlongedCycle.cycle_length;},0)
    var avgProlongedLength
    if(numProlonged!=0)
      avgProlongedLength = Math.round(totalProlongedLength/numProlonged)
    else
      avgProlongedLength =0
    totalProlongedLength = Math.round(totalProlongedLength/unique_days)
    numProlonged = Math.round(numProlonged/unique_days)
    var longestProlonged = activeProlongedCycles.reduce((acc, cycle) => acc = acc > cycle.cycle_length ? acc : cycle.cycle_length, 0);
    // console.log('numProlonged,totalProlongedLength,avgProlongedLength,longestProlonged',numProlonged,totalProlongedLength,avgProlongedLength,longestProlonged)

    var numActiveCycles = activeCycles.length
    var totalActiveLength = activeCycles.reduce(function (sum, activeCycle) {return sum + activeCycle.cycle_length;},0)
    var avgActiveLength = Math.round(totalActiveLength/numActiveCycles);
    numActiveCycles = Math.round(numActiveCycles/unique_days)
    totalActiveLength = Math.round(totalActiveLength/unique_days)
    //percent of prolonged time
    //sustract every prolonged with 35
    var minutesMoreThanAllowed = activeProlongedCycles.reduce(function (sum, activeProlongedCycle) {return sum + (activeProlongedCycle.cycle_length - 45);},0)
    var percentProlongedCycles =  Math.round((numProlonged/numActiveCycles)*100)
    var percentProlongedMinutes =  Math.round((minutesMoreThanAllowed/totalProlongedLength)*100)
    // console.log('numActiveCycles,totalActiveLength,avgActiveLength,minutesMoreThanAllowed,percentProlongedCycles,percentProlongedMinutes',numActiveCycles,totalActiveLength,avgActiveLength,minutesMoreThanAllowed,percentProlongedCycles,percentProlongedMinutes)

    statsArray['breaks_num'] = numBreaks
    statsArray['breaks_total_length'] = totalBreakLength
    statsArray['breaks_avg_length'] = avgBreakLength
    statsArray['breaks_longest'] = longestBreak

    statsArray['prolonged_num'] = numProlonged
    statsArray['prolonged_total_length'] = totalProlongedLength
    statsArray['prolonged_avg_length'] = avgProlongedLength
    statsArray['prolonged_longest'] = longestProlonged
    statsArray['prolonged_minutesMoreThanAllowed'] = minutesMoreThanAllowed
    statsArray['prolonged_percentProlongedCycles'] = percentProlongedCycles
    statsArray['prolonged_percentProlongedMinutes'] = percentProlongedMinutes

    statsArray['active_num'] = numActiveCycles
    statsArray['active_total_length'] = totalActiveLength
    statsArray['active_avg_length'] = avgActiveLength
    statsArray['unique_days'] = unique_days
  }else{
    statsArray['breaks_num'] = 'NaN'
    statsArray['breaks_total_length'] = 'NaN'
    statsArray['breaks_avg_length'] = 'NaN'
    statsArray['breaks_longest'] = 'NaN'

    statsArray['prolonged_num'] = 'NaN'
    statsArray['prolonged_total_length'] = 'NaN'
    statsArray['prolonged_avg_length'] = 'NaN'
    statsArray['prolonged_longest'] = 'NaN'
    statsArray['prolonged_minutesMoreThanAllowed'] = 'NaN'
    statsArray['prolonged_percentProlongedCycles'] = 'NaN'
    statsArray['prolonged_percentProlongedMinutes'] = 'NaN'

    statsArray['active_num'] = 'NaN'
    statsArray['active_total_length'] = 'NaN'
    statsArray['active_avg_length'] = 'NaN'
    statsArray['unique_days'] = 'NaN'
  }

  return statsArray
}
