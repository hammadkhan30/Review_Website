const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name:String,
  username: {
    unique: true,
    type: String
  },
  password: String,
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

module.exports = User;
