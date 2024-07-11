const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Review = require("./review.js")
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  review:[{
    type: Schema.Types.ObjectId,
     ref: 'Review'
  }],
  owner:{
    type: Schema.Types.ObjectId,
     ref: 'User'
  },
  image: {
   url:{
    type: String
   },
   filename:{
    type:String
   }
  },
  price:{
    type: Number,
  default:0

  } ,

  location: String,
  country: String,
}

);

listingSchema.post('findOneAndDelete', async function (doc) {
    const listing = doc;
    await Review.deleteMany({ _id: { $in: listing.review } });
});
const listing  = mongoose.model('listing', listingSchema);



module.exports= listing;