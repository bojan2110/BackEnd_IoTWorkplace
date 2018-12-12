var mongoose = require('mongoose');
// Setup schema
var stepsSchema = mongoose.Schema({
    userid: {
        type: Number,
        required: true
    },
    numsteps: {
        type: Number,
        required: true
    },
    date: String,
    time: String
});
// Export Contact model
var Steps = module.exports = mongoose.model('steps', stepsSchema);
module.exports.get = function (callback, limit) {
    Steps.find(callback).limit(limit);
  }
