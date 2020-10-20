const mongoose = require('mongoose');
const review = require('./review');
const rating = require('./rating');

const reviewSchema = new mongoose.Schema({
  user : String,
  comment : String
});

const ratingSchema = new mongoose.Schema({
  user : String,
  rating : Number
});

const movieSchema = new mongoose.Schema({
  movieName : String,
  movieCategory : String,
  director : String,
  language : String,
  summary : String,
  img : {
    data : Buffer,
    contentType : String
  },
  rating : [ratingSchema],
  reviews : [reviewSchema]
})

const movies = mongoose.model("movies",movieSchema);

module.exports = movies;
