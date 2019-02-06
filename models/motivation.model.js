var mongoose = require('mongoose');
// Setup schema
var motivationSchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    motivation : { type: Number, required: true },
    date: { type: String ,required: true}
    // date: { type: Date , default:Date.now ,required: true}
});
// Export Contact model
var Motivation = module.exports = mongoose.model('motivations', motivationSchema);
module.exports.get = function (callback, limit) {
    Motivation.find(callback).limit(limit);
  }
