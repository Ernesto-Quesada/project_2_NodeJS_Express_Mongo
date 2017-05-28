const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: { type: String, required: true, minlength:10,maxlength:400 },
  stars: { type: Number, required:true, min:1,max:5},
//   maxSpeed:{ type: Number, default: 0},
  author:{ type: String,required: true },
//   imageUrl: { type: String },

});

const photoReview = mongoose.model('Review', reviewSchema);


module.exports = photoReview;