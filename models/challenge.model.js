var mongoose = require('mongoose');
// Setup schema
var challengeSchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    challengeid : { type: Number, required: true },
    status : { type: Number, required: true },
    date: { type: Date , default:Date.now ,required: true}
});
// Export Challenge model
var Challenge = module.exports = mongoose.model('challenges', challengeSchema);
module.exports.get = function (callback, limit) {
    Challenge.find(callback).limit(limit);
}
