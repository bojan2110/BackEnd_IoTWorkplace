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
    var btentry = new BluetoothEntry();
    btentry.deviceName = req.body.deviceName ? req.body.deviceName : btentry.deviceName;
    btentry.rssi = req.body.rssi;
    btentry.collectionTime=req.body.collectionTime;
    btentry.create_date=req.body.create_date;
  
// save the contact and check for errors
    btentry.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New Bluetooth Entry Created!',
            data: btentry
        });
    });
};
