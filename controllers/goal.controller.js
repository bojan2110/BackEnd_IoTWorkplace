Goal = require('../models/goal.model');

exports.getGoals = function (req, res) {

    var findquery={
      "userid":req.params.userid
    }

    Goal.find(findquery,
    function (err, goaldata) {
        if (err) {
          console.log('Error reading Goal  data ',err)
            res.json({
                status: "error",
                message: err,
            });
        }
        else
        {
          if(goaldata === 'undefined')
          {
            console.log('Goal undefined')
            res.json({
                status: "Goal undefined",
                intervals:[]
            });
          }
          else if (goaldata.length == 0){
            console.log('Goal Empty ')
            res.json({
                status: "Goal Empty",
                intervals:[]
            });
          }
          else{

            res.json({
                status: "success",
                intervals:goaldata
            });
          }
        }
      }
    );

};

exports.postGoals = function (req, res) {

  var goal = new Goal();
  goal.userid = req.body.userid;
  goal.prolongedgoal = req.body.prolongedgoal;
  goal.sittinggoal = req.body.sittinggoal;
  goal.collectionTime=req.body.collectionTime;


  // save the contact and check for errors
  goal.save(function (err) {
      if (err)
          {
            res.json(err);
            console.log('error adding new goal')
            console.log(err)
          }
      else
      {
        console.log('new goal added')
        res.json({
                  message: 'New goal Created!',
                  data: goal
              });
      }
  });

};
