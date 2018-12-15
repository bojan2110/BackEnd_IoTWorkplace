SitCycleEntry = require('../models/sitcycle.model');
// Handle index actions
exports.getallsitcycledata = function (req, res) {

    var date=req.params.date;
    var hour=req.params.hour;
    var min=req.params.min;


      var findquery={}
      if (typeof hour == 'undefined')
        findquery={'date':date}
      else
         findquery={$or:[{'date':date,'hour':{ $lte: hour},'minute': {$lte: min}},{'date':date,'hour':{ $lt: hour}}]}
    //{'date':date, 'hour':{ $lte: hour}, 'minute': {$lte: min}}
    SitCycleEntry.find(findquery,
    function (err, messagesdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        // return array (messagesData) is empty
        if (!messagesdata.length) {
          res.json({
              status: "success",
              numcycles: 0
          });
        }

        else{
          console.log(messagesdata)
          res.json({
              status: "success",
              cycle_events: messagesdata,
              numcycles:messagesdata.length
          });
      }
    });
};
