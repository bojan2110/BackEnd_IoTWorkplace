var mongoose = require('mongoose');
// Setup schema
var microphoneEntrySchema = mongoose.Schema({
    userid: {  type: Number,required: true},
    speakStatus: {
        type: Number,
        required: true
    },
    collectionTime: {
        type: Number,
        required: true,
        unique: true
    }
});

microphoneEntrySchema.set('timestamps', true);
// Export Contact model
var MicrophoneEntry = module.exports = mongoose.model('microphoneentry', microphoneEntrySchema);
module.exports.get = function (callback, limit) {
    MicrophoneEntry.find(callback).limit(limit);
}
