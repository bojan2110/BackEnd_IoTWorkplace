
MessagesEntry = require('../models/dashboardmessages.model.js');
var mongoose = require('mongoose');
// Handle index actions
exports.getmessages = function (req, res) {
    //type of messages to be obtained
    var messagetype=req.params.messagetype;
    var messageid=req.params.messageid;

    // case when message request is all messages
    if (messagetype=='all')
    {
      MessagesEntry.get(function (err, messagesdata) {
              if (err) {
                  res.json({
                      status: "error",
                      message: err,
                  });
              }
              res.json({
                  status: "success",
                  message: "Messages Data retrieved successfully",
                  data: messagesdata
              });
          });
    }
    //specific message type is required
    else {

      //
      if (typeof messageid !== 'undefined')
      {

        MessagesEntry.findById(messageid, function (err, messagesdata) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            // // return array (messagesData) is empty
            // if (!messagesdata.length) {
            //   res.sendStatus(404);
            // }

            else{
              console.log(messagesdata)
              res.json({
                  status: "success",
                  message: "",
                  data: messagesdata
              });
          }
        });
      }
      else{
        MessagesEntry.find({'type':messagetype}, function (err, messagesdata) {

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            // return array (messagesData) is empty
            if (!messagesdata.length) {
              res.sendStatus(404);
            }

            else{
              res.json({
                  status: "success",
                  message: "",
                  data: messagesdata
              });
          }
        });
    }
    }
};
