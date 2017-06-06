const express = require('express');
const router = express.Router();
const ensure = require('connect-ensure-login');
const multer = require('multer');
const path = require('path');


// require the Photo model here
const Photo = require('../models/photoModel.js');

//requires the User model because there is a query in one 
//route that will use the User model
const User = require('../models/userModel.js');

// ===   Render a list of all Photos and sends ================
//====   the list with photoList variable ================
//====    to the view =====================================
router.get('/photo', (req, res, next) => {
  //const photoList = ["/images/animalseries1.jpg", "/images"]

  Photo.find((err, photoList) => {
    if (err){
      next(err); 
      return; 
    }
    // if(photoList){
    //    photoList.forEach((onePicture)=>{
    //      console.log('OOOONEEE',onePicture);
    //      let test= onePicture.owner.push
        {res.render('photos/index.ejs', 
          { photoList: photoList});
          console.log('thelist',photoList);
        }
       })
    }
 // }
  );
//});

//=== Get  and render  the view for   ================
//======== the form of new photos   =====================
router.get('/photo/new', (req, res, next) => {

  res.render('photos/newPhoto.ejs', {
      
    });
});


//=== Post the form and save the data   =======
//======== in the data base   =====================
const myUploader = multer({dest: path.join(__dirname, '../public/images')});
router.post('/photo',
 ensure.ensureLoggedIn('/login'),
 myUploader.single('photo'),

(req, res, next) => {
        console.log( req.body );
        console.log(req.file);

      const newPhotoInfo = {
        photoTitle: req.body.photoTitle,
        yearTaken: req.body.yearTaken,
        //author: req.user._id,
        owner:req.user._id,
        description: req.body.description,
        imageUrl: `/images/${req.file.filename}`
      }
    const newPhoto = new Photo(newPhotoInfo);
    newPhoto.save( (err) => {
        if (err) { 
          res.render('photos/newPhoto.ejs', {
              errors:newPhoto.errors
          });
        return}
        // redirect to the list of photo if it saves
        return res.redirect('/myaccount');
      });
        console.log('-------+-----')
});
//========Details =============
router.get('/photo/:id',(req,res,next) => { 
  const photoId=req.params.id;
  Photo.findById(photoId,(err,thePhoto) => {
    if(err){  
      next(err);
       return;
    }
    if (thePhoto){ 
      User.findById(thePhoto.owner, (err,theUser)=>{
        if (err) {
           next(err);
           return;
        }
        // if the user is found render the view and pass 
        //those variables wth the info
        if (theUser) {
          Photo.find({owner:theUser._id},(err,userPhotoList)=>{
             if (err) {
                next(err);
                return;
             }
             { res.render('photos/photoDetail.ejs',{ 
                 photo:thePhoto,
                 usuario:theUser,
                 photoListAll:userPhotoList
              });
              console.log('>>>>>>>>>theUser',theUser);
              }
          })
        }
      });
    }
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
        description: req.body.description,
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

router.post('/photo/:id/delete', ensure.ensureLoggedIn('/login'),(req, res, next) => {
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
