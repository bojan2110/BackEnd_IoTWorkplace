var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    useremail: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    }
});
// Export Contact model
var User = module.exports = mongoose.model('users', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
