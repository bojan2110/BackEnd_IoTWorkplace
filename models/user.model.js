var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    userid: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    location: String,
    workdays: [{
                  day: {
                      type: String,
                      required: true
                  },
                  starttime: {
                      type: String,
                      required: true
                  },
                  endtime: {
                      type: String,
                      required: true
                  }
              }]
});
// Export Contact model
var User = module.exports = mongoose.model('users', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
