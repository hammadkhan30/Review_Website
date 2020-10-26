const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:String,
  username: {
    unique: true,
    type: String
  },
  password: String,
})

const User = new mongoose.model("User",userSchema);

module.exports = User;
