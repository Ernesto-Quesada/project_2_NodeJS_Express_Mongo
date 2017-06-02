// Iteration #1
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/photostore');


const Photo = require('../models/photoModel.js');


const photos = [
  //1 
  { photoTitle: 'Elephant', yearTaken: 2015, author:'Max',description: "Big mammal ", imageUrl:'/images/animalseries1.jpg' },

  //2
  { photoTitle: 'Bird color', yearTaken: 2016, author: 'Pedro', description: "beauty bird", imageUrl:'/images/animalseries3.jpg' },


  //3
  { photoTitle: 'Geico', yearTaken:2015, author:'Me' , description: "TGreen geico", imageUrl:'/images/animalseries4.jpg'},

  //4
  { photoTitle: 'Colored Bird', yearTaken: 2015, author:'Ben',description: "colorful bird ", imageUrl:'/images/animalseries2.jpg' },

  //5
  { photoTitle: 'Elephant Feet', yearTaken: 2016, author: 'Mary', description: "Big elephant feet", imageUrl:'/images/animalseries7.jpg' },

//6
  { photoTitle: 'Lion', yearTaken:2015, author:'Me' , description: "Resting lion", imageUrl:'/images/animalseries8.jpg'},
  //7
  { photoTitle: 'Gorilla', yearTaken: 2015, author:'Max',description: "Restion gorilla ", imageUrl:'/images/animalseries9.jpg' },
//8
{ photoTitle: 'Zebra', yearTaken: 2016, author: 'Julian', description: "Zebra stripes", imageUrl:'/images/animalseries10.jpg' },

//9
{ photoTitle: 'Train Parts', yearTaken:2015, author:'Me' , description: "Train parts and wheels", imageUrl:'/images/machineseries1.jpg'},

//10
{ photoTitle: 'Nuts and Bolts', yearTaken: 2015, author:'Ernest',description: "Nuts and bolts from a train ", imageUrl:'/images/machineseries2.jpg' },
//11
{ photoTitle: 'Wheels and bolts', yearTaken: 2016, author: 'Ernest', description: "beautiful combination of wheels and trainbolts", imageUrl:'/images/machineseries3.jpg' },
//12

  { photoTitle: 'Locomotive', yearTaken:2015, author:'Me' , description: "Antique locomotive from South Florida", imageUrl:'/images/machineseries4.jpg'}
  
];


  // db.photos.insertMany()
Photo.create(photos, (err, photoDoc) => {
  if (err) {
    throw err;
  }

  photoDoc.forEach((onePhoto) => {
    console.log(`NEW Photo ${onePhoto.imageUrl} -> ${onePhoto._id}`);
  });
  //mongoose.disconnect();
});