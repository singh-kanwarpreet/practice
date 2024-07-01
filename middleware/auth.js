module.exports.auth = (req,res,next)=>{
    if (!res.locals.auth){
       req.flash("error","You must logged in");
       req.session.url = req.originalUrl;
       res.redirect("/listing/user/login");
        } 
    next();
}


module.exports.Saveurl = (req,res,next)=>{
    if (req.session.url){
        res.locals.url = req.session.url
    } 
    else{
        res.locals.url = "/listing"
    }
    next();
}




