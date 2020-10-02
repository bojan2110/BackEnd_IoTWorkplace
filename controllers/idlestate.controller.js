IdleState = require('../models/idlestate.model');
// Handle index actions
exports.index = function (req, res) {
    IdleState.get(function (err, idlestatedata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "IdleState Data retrieved successfully!",
            data: idlestatedata
        });
    });
};

exports.new = function (req, res) {

  var idlestate = new IdleState();
  idlestate.userid = req.body.userid;
  idlestate.deviceid = req.body.userid;
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
