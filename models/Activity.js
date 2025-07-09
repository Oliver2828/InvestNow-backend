const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  action: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
