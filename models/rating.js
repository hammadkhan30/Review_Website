const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  //user : String,
  rating : Number
});

const rating = mongoose.model("rating",ratingSchema);

module.exports = rating;
