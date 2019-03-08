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
    btentry.deviceName = bt.deviceName
    btentry.rssi = bt.rssi;
    btentry.collectionTime=bt.collectionTime;
    btentry.create_date=bt.create_date;
    data.push(btentry)
  }
  //save the contact and check for errors
  BluetoothEntry.insertMany(data,function (err) {
      if (err)
        {
          res.json(err);
        }
        else{
        res.json({
            message: 'New Bluetooth Entry Created!'
        });
      }
  });

};
