const express = require('express');
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap");
const {Rschema} = require("../utils/data_validate");
const ExpressError = require("../utils/ExpressError");
const Review = require("../model/listing/review");
const listing = require("../model/listing/listing");


const reviewValidate =  async(req, res, next) => {
    
    const result = await Rschema.validate(req.body.review);

    if (result.error) {
next(new ExpressError(400, result.error.details[0].message)); 
    } else {
        next(); 
    }
};

// Delete review
router.delete('/:rid', asyncwrap(async (req, res) => {
    const { id, rid } = req.params;

 
    await listing.findByIdAndUpdate(
        id,
        { $pull: { review: rid } }
    );

    await Review.findByIdAndDelete(rid);
    req.flash("success","Review Deleted");
    return res.redirect(`/listing/${id}`);
}));

// Add review to a listing
router.post("/", reviewValidate, asyncwrap(async (req, res, next) => {
    const id = req.params.id;
    const re = await new Review({...req.body.review});
    const list = await listing.findById(id);
    list.review.push(re);
    await re.save();
    await list.save();
    req.flash("success","New Review Created");

    res.redirect(`/listing/${id}`);
}));

module.exports = router;