var mongoose = require('mongoose');
// Setup schema
var idleStateAppEventsSchema = mongoose.Schema({
    userid: {type: String,required: true, unique: true},
    deviceid: {type: String,required: true, unique: true},
    collectionTime: {type: Number, required: true, unique: true},
    eventid: {type: Number,required: true}
});

idleStateAppEventsSchema.set('timestamps', true);
idleStateAppEventsSchema.index({ userid:1 , deviceid:1, collectionTime: 1}, { unique: true})

var IdleStateAppEvents = module.exports = mongoose.model('db_idlestate_app_events', idleStateAppEventsSchema);
module.exports.get = function (callback, limit) {
    IdleStateAppEvents.find(callback).limit(limit);
}
