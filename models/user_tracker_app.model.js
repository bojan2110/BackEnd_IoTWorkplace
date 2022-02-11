
var mongoose = require('mongoose');
var userTrackerAppSchema = mongoose.Schema({
    userid: {type: Number,required: true},
    collectionTime: {type: Number, required: true, unique: true}
});
// Export Contact model
var userTrackerAppSchema = module.exports = mongoose.model('db_usertrackerapp', userTrackerAppSchema);
module.exports.get = function (callback, limit) {
    userTrackerAppSchema.find(callback).limit(limit);
}
