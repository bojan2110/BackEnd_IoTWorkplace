BluetoothEntry = require('../models/bluetoothentry.model');
// Handle index actions
exports.index = function (req, res) {
    BluetoothEntry.get(function (err, btdata) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Bluetooth Data retrieved successfully",
            data: btdata
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {

  var data = []
  for(const bt of req.body){

    var btentry = new BluetoothEntry();
    btentry.userid = bt.userid
    btentry.deviceName = bt.deviceName
    btentry.rssi = bt.rssi;
    btentry.collectionTime=bt.collectionTime;
    data.push(btentry)
  }
  //save the contact and check for errors
  BluetoothEntry.insertMany(data,function (err) {
      if (err)
        {
          res.json(err);
        }
        else{
          var ts=data.map(a => a.collectionTime)
          console.log('success : "BT Entries Inserted", status : 200')
          res.json({message : "BT Entries Inserted", status : 200,timestamps:ts});
        }
  });

};
