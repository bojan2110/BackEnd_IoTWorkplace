var mongoose = require('mongoose');
// Setup schema
var workdaysSchema = mongoose.Schema({
    userid: {  type: String,required: true},
    monday : { type: Number, required: true },
    tuesday : { type: Number, required: true },
    wednesday : { type: Number, required: true },
    thursday : { type: Number, required: true },
    friday : { type: Number, required: true },
    saturday : { type: Number, required: true },
    sunday : { type: Number, required: true },
    collectionTime: { type: Number, required: true, unique: true}
});
// Export Challenge model
var Workdays = module.exports = mongoose.model('workdays', workdaysSchema);
module.exports.get = function (callback, limit) {
    Workdays.find(callback).limit(limit);
}
