const listing = require("../model/listing/listing");
const review = require("../model/listing/review");

module.exports.auth = (req,res,next)=>{
    if (!res.locals.auth){
       req.flash("error","You must logged in");
       req.session.url = req.originalUrl;
       return res.redirect("/listing/user/login");
        } 
    next();
}


module.exports.saveUrl = (req,res,next)=>{
    if (req.session.url){
        res.locals.url = req.session.url
    } 
    else{
        res.locals.url = "/listing"
    }
    next();
}

module.exports.authcheck = async(req,res,next)=>{
   let {id}= req.params;

   let check = await listing.findById(id);
   if (!req.user._id.equals(check.owner)) {
        req.flash("error","You don't have rights to change");
       return res.redirect("/listing")
   } 
    next();
}

module.exports.authReviewCheck = async(req,res,next)=>{
   const { id, rid } = req.params;

   let check = await review.findById(rid);
   if (!req.user._id.equals(check.owner._id)) {
        req.flash("error","You don't have rights to change");
       return res.redirect(`/listing/${id}`)
   } 
    next();
}

