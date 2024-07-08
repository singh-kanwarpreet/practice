const Review = require("../model/listing/review");
const listing = require("../model/listing/listing");

module.exports.deleteReview = async (req, res) => {
    const { id, rid } = req.params;
    
    await listing.findByIdAndUpdate(
        id,
        { $pull: { review: rid } }
    );

    await Review.findByIdAndDelete(rid);
    req.flash("success", "Review Deleted");
    return res.redirect(`/listing/${id}`);
}

module.exports.postReview = async (req, res, next) => {
    const id = req.params.id;
    req.body.review.owner = req.user._id;
    const re = new Review({ ...req.body.review });
    const list = await listing.findById(id);
    list.review.push(re);
    await re.save();
    await list.save();
    req.flash("success", "New Review Created");

    res.redirect(`/listing/${id}`);
}
