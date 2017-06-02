const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: { type: String, required: true, minlength:10,maxlength:400 },
  stars: { type: Number, required:true, min:1,max:5},
  author:{ type: String,required: true }
});

const photoReview = mongoose.model('Review', reviewSchema);


module.exports = photoReview;