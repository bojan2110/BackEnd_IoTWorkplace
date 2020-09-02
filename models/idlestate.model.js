var mongoose = require('mongoose');
// Setup schema
var idleStateSchema = mongoose.Schema({
    userid: {type: String,required: true, unique: true},
    collectionTime: {type: Number, required: true, unique: true},
    idleTime: {type: Number,required: true}
});

idleStateSchema.set('timestamps', true);
idleStateSchema.index({ userid:1 , collectionTime: 1}, { unique: true})

var IdleState = module.exports = mongoose.model('db_idlestate', idleStateSchema);
module.exports.get = function (callback, limit) {
    IdleState.find(callback).limit(limit);
}
