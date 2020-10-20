const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    unique: true,
    type: String
  },
  password: String
});

const adminLog = new mongoose.model("adminLog",adminSchema);

module.exports = adminLog;
