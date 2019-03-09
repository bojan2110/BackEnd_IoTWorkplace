var mongoose = require('mongoose');
// Setup schema
var microphoneEntrySchema = mongoose.Schema({
    speakStatus: {
        type: Number,
        required: true
    },
    collectionTime: {
        type: Number,
        required: true
        }
});

microphoneEntrySchema.set('timestamps', true);
// Export Contact model
var MicrophoneEntry = module.exports = mongoose.model('microphoneentry', microphoneEntrySchema);
module.exports.get = function (callback, limit) {
    MicrophoneEntry.find(callback).limit(limit);
}
