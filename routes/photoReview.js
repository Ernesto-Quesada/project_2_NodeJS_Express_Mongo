const express = require('express');
const Photo = require('../models/photoModel.js')
const Review = require('../models/photoReview.js');
const reviewRoute = express.Router();

// address where review will be is like /Photo
reviewRoute.get('/photos/:photoid/reviews/new', (req,res,next)=>{
//                              |
const myPhotoId =req.params.photoid;
Photo.findById(myPhotoId, (err, thePhoto) =>{
if (err){
    next(err);
    return;
}
res.render('reviews/photoReview.ejs',{
    photo: thePhoto
        });
    });
});


reviewRoute.post('/photos/:photoid/reviews', (req, res, next) => {
const myPhotoId =req.params.photoid;

  Photo.findById(myPhotoId, (err, thePhoto) => {
    if (err) {
      next(err);
      return;
    }

      //     REQUIRES THE REVIEW MODEL
      //                     |
    const theReview = new Review({
      content: req.body.content,
      stars: req.body.stars,
      author: req.body.author
    });
    thePhoto.reviews.push(theReview);
    thePhoto.save((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`/photo/${myPhotoId}`);
    });
  });
});
module.exports = reviewRoute;
