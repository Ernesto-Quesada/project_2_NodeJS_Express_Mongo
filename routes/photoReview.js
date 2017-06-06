const express = require('express');
const Photo = require('../models/photoModel.js')
const Review = require('../models/photoReview.js');
const reviewRoute = express.Router();

// Renders the review page before posting it
reviewRoute.get('/photos/:photoid/reviews/new', (req,res,next)=>{
//                              |
const myPhotoId =req.params.photoid;
Photo.findById(myPhotoId, (err, thePhoto) =>{
if (err){
    next(err);
    return;
}
res.render('reviews/photoReview.ejs',{
  //passing photo to the view
    photo: thePhoto
        });
    console.log(thePhoto)
    });
});

reviewRoute.post('/photo/:photoid/reviews', (req, res, next) => {
  const myPhotoId =req.params.photoid;

  Photo.findById(myPhotoId, (err, thePhoto) => {
    if (err) {
      next(err);
      return;
    }
    ave = thePhoto.reviews.length;
      console.log("=========",ave);
    if(ave!==0){
      
      var sum=0;
      thePhoto.reviews.forEach((star) => {
          console.log('+=+=+======',star.stars);
          sum =star.stars+sum;
          console.log('+=///',sum);
          });
    console.log("-SUM of reviews outside de loop---->>>>",sum);
    var average=sum/ave;
    console.log(average);
    } else average= req.body.stars;

      //     REQUIRES THE REVIEW MODEL
      //                     |
    const theReview = new Review({
      content: req.body.content,
      stars: req.body.stars,
      author: req.body.author,
      starAve:average,
      
    });
    
    thePhoto.reviews.push(theReview);
    console.log('reviews',thePhoto.reviews.length);
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
