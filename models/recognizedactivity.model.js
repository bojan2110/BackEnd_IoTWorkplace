var mongoose = require('mongoose');
// Setup schema
var activitySchema = mongoose.Schema({
    userid: {  type: String,required: true},
    dataSource: {type: String,required: true},
    activityType: {  type: String,required: true},
    confidence: {  type: Number,required: true},
    collectionTime: {
        type: Number,
        required: true
    }

});
activitySchema.set('timestamps', true);

var Activity = module.exports = mongoose.model('activity', activitySchema);
module.exports.get = function (callback, limit) {
    Activity.find(callback).limit(limit);
}
