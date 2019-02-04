var mongoose = require('mongoose');
// Setup schema
var stepsSchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    //or just step_timestamps: [Date]
    //[{ type: Date, default: Date.now , required: true }]
    date : { type: String, required: true },
    steps: {  type: Number,required: true}
});
// Export Contact model
var Steps = module.exports = mongoose.model('steps', stepsSchema);
module.exports.get = function (callback, limit) {
    Steps.find(callback).limit(limit);
  }
