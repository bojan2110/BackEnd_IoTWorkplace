var mongoose = require('mongoose');
// Setup schema
var bluetoothEntrySchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    deviceName: {
        type: String,
        required: true
    },
    rssi: {
        type: Number,
        required: true
    },
    collectionTime: {
	       type: Number,
	       required: true,
         unique: true
	  }
});

bluetoothEntrySchema.set('timestamps', true);
// Export Contact model
var BluetoothEntry = module.exports = mongoose.model('bluetoothentry', bluetoothEntrySchema);
module.exports.get = function (callback, limit) {
    BluetoothEntry.find(callback).limit(limit);
}
