var mongoose = require('mongoose');
// Setup schema
var goalSchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    goalid : { type: Number, required: true },
    acceptedgoal : { type: Number, required: true },
    recommendedgoal : { type: Number, required: true },
    date: { type: Date , default:Date.now ,required: true}
});
// Export Challenge model
var Goal = module.exports = mongoose.model('goals', goalSchema);
module.exports.get = function (callback, limit) {
    Goal.find(callback).limit(limit);
}
