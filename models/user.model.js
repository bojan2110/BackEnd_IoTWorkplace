var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    location: String,
    workdays: [{
                  day: {
                      type: String,
                      default: ''
                  },
                  starttime: {
                      type: String,
                      default: ''
                  },
                  endtime: {
                      type: String,
                      default: ''
                  }
              }]
});
// Export Contact model
var User = module.exports = mongoose.model('users', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
