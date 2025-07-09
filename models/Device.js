const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  type: String,
  location: String,
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
