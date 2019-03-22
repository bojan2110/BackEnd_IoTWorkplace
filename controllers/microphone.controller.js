
MicrophoneEntry = require('../models/microphoneentry.model');
// Handle index actions
exports.index = function (req, res) {
    MicrophoneEntry.get(function (err, micdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Microphone Data retrieved successfully!",
            data: micdata
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {

    var data = []
    for(const mic of req.body){
      var micentry = new MicrophoneEntry();
      micentry.userid = mic.userid;
      micentry.speakStatus = mic.speakStatus;
      micentry.collectionTime=mic.collectionTime;
      data.push(micentry)
    }
    //save the contact and check for errors
    MicrophoneEntry.insertMany(data,function (err) {
        if (err)
          {
            res.json(err);
          }
          else{
            var ts=data.map(a => a.collectionTime)
            console.log('success : "MIC Entries Inserted", status : 200')
            res.json({message : "MIC Entries Inserted", status : 200,timestamps:ts});
        }
    });
};
