const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/asyncwrap");
const { Rschema } = require("../utils/data_validate");
const ExpressError = require("../utils/ExpressError");
const Review = require("../model/listing/review");
const listing = require("../model/listing/listing");
const { auth, authReviewCheck } = require("../middleware/auth.js");
const reviewCode = require("../controllers/review.js");

const reviewValidate = async (req, res, next) => {
    const result = await Rschema.validate(req.body.review);

    if (result.error) {
        next(new ExpressError(400, result.error.details[0].message));
    } else {
        next();
    }
};

// Delete review
router.delete('/:rid', auth, authReviewCheck, asyncwrap(reviewCode.deleteReview));

// Add review to a listing
router.post("/", auth, reviewValidate, asyncwrap(reviewCode.postReview));

module.exports = router;
