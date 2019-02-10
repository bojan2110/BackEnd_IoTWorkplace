var mongoose = require('mongoose');
// Another Schema giving details on which user received which card at what time
var flashCardSchema = mongoose.Schema({
    _id: {type: Number,required: true},
    type: {type: Number,required: true},
    message: {
        type: String,
        required: true
    },
    goal: {type: Number},
    goalid: {type: Number}

});
// Export Contact model
var FlashCards = module.exports = mongoose.model('flashcards', flashCardSchema);
module.exports.get = function (callback, limit) {
    FlashCards.find(callback).limit(limit);
}
