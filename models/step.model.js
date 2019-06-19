var mongoose = require('mongoose');
// Setup schema
var stepSchema = mongoose.Schema({
    userid: {type: String,required: true},
    dataSource: {type: String,required: true},
    collectionTime: {type: Number, required: true, unique: true},
    numSteps: {type: Number,required: true},
    sit: {type: Number,default: 0}

});

stepSchema.set('timestamps', true);
stepSchema.index({ collectionTime: 1}, { unique: true})

var Step = module.exports = mongoose.model('db_steps', stepSchema);
module.exports.get = function (callback, limit) {
    Step.find(callback).limit(limit);
}
