Workdays = require('../models/workdays.model');

exports.getWorkDays = function (req, res) {

    var findquery={
      "userid":req.params.userid
    }

    Workdays.find(findquery,
    function (err, workdaysdata) {
        if (err) {
          console.log('Error reading Workdays  data ',err)
            res.json({
                status: "error",
                message: err,
            });
        }
        else
        {
          if(workdaysdata === 'undefined')
          {
            console.log('Workdays undefined')
            res.json({
                status: "Workdays undefined",
                intervals:[]
            });
          }
          else if (workdaysdata.length == 0){
            console.log('Workdays Empty ')
            res.json({
                status: "Workdays Empty",
                intervals:[]
            });
          }
          else{

            res.json({
                status: "success",
                intervals:workdaysdata
            });
          }
        }
      }
    );

};

exports.postWorkDays = function (req, res) {

  var workdays = new Workdays();
  workdays.userid = req.body.userid;
  workdays.monday = req.body.monday;
  workdays.tuesday = req.body.tuesday;
  workdays.wednesday=req.body.wednesday;
  workdays.thursday = req.body.thursday;
  workdays.friday = req.body.friday;
  workdays.saturday = req.body.saturday;
  workdays.sunday = req.body.sunday;
  workdays.collectionTime=req.body.collectionTime;


  // save the contact and check for errors
  workdays.save(function (err) {
      if (err)
          {
            res.json(err);
            console.log('error adding new Workdays')
            console.log(err)
          }
      else
      {
        console.log('new Workdays added')
        res.json({
                  message: 'New Workdays Created!',
                  data: workdays
              });
      }
  });

};
