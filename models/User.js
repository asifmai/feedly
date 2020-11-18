const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: String,
}, {strict: false});

module.exports = mongoose.model('User', UserSchema);