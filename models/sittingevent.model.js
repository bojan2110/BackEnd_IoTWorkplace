var mongoose = require('mongoose');
// Setup schema
var sitEventSchema = mongoose.Schema({
    userid: { type: Number, required: true},
    date : { type: String, required: true },
    sit: {  type: Number,required: true}
});
// Export Contact model
//sits - corresponds to the database name in MongoDB
var Sit = module.exports = mongoose.model('sits', sitEventSchema);
module.exports.get = function (callback, limit) {
    Sit.find(callback).limit(limit);
}
