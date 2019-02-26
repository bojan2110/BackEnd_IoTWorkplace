User = require('../models/user.model');

//get user method
exports.getUser = function (req, res){

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
exports.addUser = function (req, res){
  var user = new User();
  user.userid = req.body.userid;
  user.username = req.body.username;
  user.location = req.body.location;
  user.workdays = req.body.workdays;
// save the contact and check for errors
  user.save(function (err) {
      if (err)
          res.json(err);
      else
      res.json({
                message: 'New User Created!',
                data: user
            });
  });
};

//update user entry - workdays or location
