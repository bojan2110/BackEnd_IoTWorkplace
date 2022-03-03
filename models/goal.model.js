var mongoose = require('mongoose');
// Setup schema
var goalSchema = mongoose.Schema({
    userid: {  type: String,required: true},
    prolongedgoal : { type: Number, required: true },
    sittinggoal : { type: Number, required: true },
    collectionTime: { type: Number, required: true, unique: true}
});
// Export Challenge model
var Goal = module.exports = mongoose.model('goals', goalSchema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}
