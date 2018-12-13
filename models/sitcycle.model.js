var mongoose = require('mongoose');
// Setup schema
var sitCycleSchema = mongoose.Schema({
    userid: {
        type: Number,
        required: true
    },
    date: String,
    time: String
});
// Export Contact model
var SitCycle = module.exports = mongoose.model('sitcycle', sitCycleSchema);

module.exports.get = function (callback, limit) {
    SitCycle.find(callback).limit(limit);
}
