var mongoose = require('mongoose');
// Setup schema
var sitSchema = mongoose.Schema({
    userid: {type: String,required: true},
    dataSource: {type: String,required: true},
    collectionTime: {type: Number, required: true, unique: true},
    status: {type: Number,required: true}

});

sitSchema.set('timestamps', true);
sitSchema.index({ collectionTime: 1}, { unique: true})

var Sit = module.exports = mongoose.model('db_sits', stepSchema);
module.exports.get = function (callback, limit) {
    Sit.find(callback).limit(limit);
}
