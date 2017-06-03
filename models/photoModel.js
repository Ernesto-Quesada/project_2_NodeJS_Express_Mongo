const mongoose = require('mongoose');

const Schema = mongoose.Schema;
//---import de photoReview Schema model
const photoReview=(require('./photoReview.js'));


const photoSchema = new Schema({
  photoTitle: { type: String , required: [true, 'Please enter a title'] },
  yearTaken: { type: Number, default: 2017},
  author:{ type: String},
  description:{ type: String },
  imageUrl: { type: String },

  //reference to the user author who took the photo
  owner: { type: Schema.Types.ObjectId },
  //---reviews as subdocument of photos //
  reviews:[photoReview.schema],
  category:{ type:String,
    enum:['toys', 'industrial ', 'terrorist killer']
  }

});

const Photo = mongoose.model('Photo', photoSchema);


module.exports = Photo;