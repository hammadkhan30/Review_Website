const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user : String,
  comment : String,
  date: String
});

const review = mongoose.model("review",reviewSchema);

module.exports = review;
