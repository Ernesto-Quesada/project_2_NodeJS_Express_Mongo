var express = require('express');
const Photo = require('../models/photoModel.js');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) => {

  Photo.find((err, photoList) => {
    if (err) {
      next(err);
      return;
    }
    res.render('index.ejs', {
      photoList: photoList
    });
  });
});

module.exports = router;

