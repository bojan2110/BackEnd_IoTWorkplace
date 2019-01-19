var mongoose = require('mongoose');

var dashboardBackgroundSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  category: { type: String, required: true },
  backgroundImage: { type: String, required: true }
});

module.exports = mongoose.model('DashboardBackground', dashboardBackgroundSchema);
