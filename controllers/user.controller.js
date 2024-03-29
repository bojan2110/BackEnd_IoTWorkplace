// handles the requests for both user and user dashboard interaction functions
User = require('../models/user.model');
UserDashboardInteraction = require('../models/user_dashboard_interaction.model');
UserTrackerApp = require('../models/user_tracker_app.model');
//get user method
exports.getUserInfo = function (req, res){

  var userid=req.params.userid;
  findquery={'userid':userid}
  // console.console.log(userid);

  User.find(findquery,
  function (err, userdata) {

      if (err) {
          res.json({
              status: "error",
              message: err,
          });
      }
      else{
        res.json({
            status: "success",
            user_data: userdata
        });
      }
  });
};

//post(add) user method
exports.addUserInfo = function (req, res){
  console.log('adding new user')
  console.log(req.body)

  var user = new User();
  user.userid = req.body.userid;
  user.useremail=req.body.useremail;
// save the contact and check for errors
  user.save(function (err) {
      if (err)
          {
            res.json(err);
            console.log('error adding new user')
            console.log(err)
          }
      else
      {
        console.log('new user added')
        res.json({
                  message: 'New User Created!',
                  data: user
              });
      }
  });
};

//update user entry - workdays or location
exports.updateUserInfo = function (req, res) {
    console.log(req.body);
    User.findOneAndUpdate({ "userid" : req.body.userid}, {$set:req.body}, function(err, result){
        if(err){
            console.log(err);
        }
        console.log("RESULT: " + result);
    });
    res.send('Done')
}


//post dashboard info
exports.postDashboardInfo = function (req, res){
  var udi = new UserDashboardInteraction();
  udi.userid = req.body.userid;
  udi.date = req.body.date;
  udi.activeScreens = req.body.activeScreens;
  udi.activeTimeStart = req.body.activeTimeStart;
  udi.activeTimeEnd = req.body.activeTimeEnd;
  udi.automaticBackground = req.body.automaticBackground;
  udi.screenImportance = req.body.screenImportance;
// save the contact and check for errors
  udi.save(function (err) {
      if (err)
          res.json(err);
      else
      res.json({
                message: 'New User Dashboard Interaction Created!',
                data: udi
            });
  });
};

exports.postUserTracker = function (req, res){
  var uta = new UserTrackerApp();
  uta.userid = req.body.userid;
  uta.collectionTime = req.body.collectionTime;
// save the contact and check for errors
  uta.save(function (err) {
      if (err)
          res.json(err);
      else
      res.json({
                message: 'New UserTrackerApp entry created!',
                data: uta
            });
  });
};
