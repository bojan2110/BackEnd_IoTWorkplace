var mongoose = require('mongoose');
// Setup schema
var messagesSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    author: String,
    type: String
});
// Export Contact model
var MessagesDashboard = module.exports = mongoose.model('dashboardmessages', messagesSchema);
module.exports.get = function (callback, limit) {
    MessagesDashboard.find(callback).limit(limit);
}
