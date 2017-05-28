const express = require('express');
const router = express.Router();

// require the Photo model here
const Photo = require('../models/photoModel.js');

// ===   Render a list of Photos and sends ================
//====   the list with photoList variable ================
//====    to the view =====================================
router.get('/photo', (req, res, next) => {

  Photo.find((err, photoList) => {
    if (err) {
      next(err);
      return;
    }
    res.render('photos/index.ejs', {
      photoList: photoList
    });
  });
});

//=== Get  and render  the view for   ================
//======== the form of new photos   =====================
router.get('/photo/new', (req, res, next) => {

  res.render('photos/newPhoto.ejs', {
      
    });
});


//=== Post the the form and save the data   =======
//======== in the data base   =====================
router.post('/photo', (req, res, next) => {

      // Iteration #3
        console.log( req.body );
      const newPhotoInfo = {
        photoTitle: req.body.photoTitle,
        yearTaken: req.body.yearTaken,
        author: req.body.author,
        description: req.body.description,
        // imageUrl: req.body.imageUrl,
      }
    const newPhoto = new Photo(newPhotoInfo);
    newPhoto.save( (err) => {
        if (err) { 
          res.render('photos/newPhoto.ejs', {
              errors:newPhoto.errors
          });
        return}
        // redirect to the list of photo if it saves
        return res.redirect('/photo');
      });
});
//========Details =============
router.get('/photo/:id',(req,res,next) => {

    const photoId=req.params.id;

    Photo.findById(photoId,(err,thePhoto) => {
      if(err){
        next(err);
        return;
      }
      if (!thePhoto){
        next();
        return;
      }
      res.render('photos/photoDetail.ejs', {
        photo:thePhoto
      });
    });

});


router.get('/photo/:id/edit',(req,res,next) => {  //-----------
    const photoId = req.params.id;                 //           |
    Photo.findById(photoId,(err,thePhoto) => {     //           |
      if(err){
        next(err);
        return;
      }


    res.render('photos/editPhoto.ejs', {
      photo:thePhoto
    });
    }); 
});                                                // .        |
                                                    //         |
router.post('/photo/:id', (req, res, next) => {    //----------
    const photoId = req.params.id;
        
      const photoChanges = {
        photoTitle: req.body.photoTitle,
        yearTaken: req.body.yearTaken,
        // author: req.body.author,
        // description: req.body.description,
        // imageUrl: req.body.imageUrl,
      };
      Photo.findByIdAndUpdate( photoId,photoChanges, (err,thePhoto) =>{
        if(err){
          next(err);
          return;
        }
        res.redirect('/photo');
    });
});

router.post('/photo/:id/delete', (req, res, next) => {
    const photoId = req.params.id;
    Photo.findByIdAndRemove(photoId,(err, thePhoto) =>{
      if(err){
        next(err);
        return;
      }
      res.redirect('/photo');
    });
});




module.exports = router;
