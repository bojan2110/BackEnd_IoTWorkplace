SittingEventEntry = require('../models/sittingevent.model');
// Handle index actions
exports.getallsitdata = function (req, res) {

  var date=req.params.date;
  var hour=req.params.hour;
  var min=req.params.min;



    SittingEventEntry.find({$or:[{'date':date,'hour':{ $lte: hour},'minute': {$lte: min}},{'date':date,'hour':{ $lt: hour}}]},
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

          sortedarray=messagesdata.sort(function(a, b) {
              return parseFloat(a.hour) - parseFloat(b.hour) || parseFloat(a.minute) - parseFloat(b.minute);
          });

          var sit_sum=0;
          var one_sit_event=0


          var first_sit=true;

          var current_true=0;
          var current_false=0;

          var count_sit=0;
          var count_stand=0;


          for(var i = 0; i < sortedarray.length; i++) {
              sit_event=sortedarray[i];
              // sit is true
              if(sit_event.sit)
              {
                count_sit+=1;
                //only for initialization
                if(first_sit){
                  one_sit_event=sit_event.hour*60+sit_event.minute;
                  first_sit=false;
                }
                else{
                    if(count_sit==1)
                      {
                        one_sit_event=(sit_event.hour*60+sit_event.minute);
                        count_stand=0;
                      }
                }

              }
              //standing
              else
              {
                count_stand+=1;

                if(count_stand==1)
                  sit_sum+=(sit_event.hour*60+sit_event.minute)-one_sit_event;

                count_sit-=1;

              }
          }

          res.json({
              status: "success",
              cycle_events: sortedarray,
              numcycles:sortedarray.length,
              sit_sum: sit_sum
          });
      }
    });
};
// Handle create contact actions
exports.newsitentry = function (req, res) {
    var sitevententry = new SittingEventEntry();
    sitevententry.userid = req.body.userid;
    sitevententry.sit = req.body.sit;
    sitevententry.date=req.body.date;
    sitevententry.hour=req.body.hour;
    sitevententry.minute=req.body.minute;
// save the contact and check for errors
    sitevententry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Sit Event Entry Created!',
            data: sitevententry
        });
    });
};
