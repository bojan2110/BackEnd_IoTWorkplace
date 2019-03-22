var mongoose = require('mongoose');
// Setup schema
var stepSchema = mongoose.Schema({
    userid: {type: Number,required: true},
    dataSource: {type: String,required: true},
    collectionTime: {
        type: Number,
        required: true,
        unique: true
    }

});
stepSchema.set('timestamps', true);

var Step = module.exports = mongoose.model('db_steps', stepSchema);
module.exports.get = function (callback, limit) {
    Step.find(callback).limit(limit);
}
