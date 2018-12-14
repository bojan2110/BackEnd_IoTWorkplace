var mongoose = require('mongoose');
// Setup schema
var sittingEventSchema = mongoose.Schema({
    userid: {
        type: Number,
        required: true
    },
    sit: {
        type: Boolean,
        required: true
    },
    date: String,
    hour: Number,
    minute: Number
});
// Export Contact model
var SittingEvent = module.exports = mongoose.model('sittingevent', sittingEventSchema);
module.exports.get = function (callback, limit) {
    SittingEvent.find(callback).limit(limit);
  }
