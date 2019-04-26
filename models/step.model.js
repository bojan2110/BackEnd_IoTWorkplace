var mongoose = require('mongoose');
// Setup schema
var stepSchema = mongoose.Schema({
    userid: {type: Number,required: true},
    dataSource: {type: String,required: true},
    collectionTime: {type: Number, required: true, unique: true},
    numSteps: {type: Number,required: true}

});

stepSchema.set('timestamps', true);
stepSchema.index({ userid: 1, dataSource: 1 , collectionTime: 1}, { unique: true})

var Step = module.exports = mongoose.model('db_steps', stepSchema);
module.exports.get = function (callback, limit) {
    Step.find(callback).limit(limit);
}
