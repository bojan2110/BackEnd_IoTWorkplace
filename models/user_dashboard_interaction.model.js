
var mongoose = require('mongoose');
var userDashboardInteractionSchema = mongoose.Schema({
    userid: {type: Number,required: true},
    date:  { type: String, required: true},
    activeScreens: [{
                  screenID: {
                      type: Number ,
                      required: true
                  },
                  active: {
                      type: Boolean,
                      required: true
                  }
              }],
    activeTimeStart:{ type: String, required: true },
    activeTimeEnd:{ type: String, required: true },
    automaticBackground:{ type: Boolean, required: true },
    screenImportance: [Number]
});
// Export Contact model
var UserDashboardInteractionSchema = module.exports = mongoose.model('userdashboardinteractions', userDashboardInteractionSchema);
module.exports.get = function (callback, limit) {
    UserDashboardInteractionSchema.find(callback).limit(limit);
}
