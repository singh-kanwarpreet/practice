const express = require('express');
const router = express.Router();
const asyncwrap = require("../utils/asyncwrap");
const User = require('../model/listing/user')
const passport = require("passport");
const {saveUrl} = require("../middleware/auth.js")

router.get("/new",asyncwrap(async(req,res)=>{
	res.render("listing/signup.ejs")
}))

router.get("/login",asyncwrap(async(req,res)=>{
	res.render("listing/login.ejs")
}))

router.post("/login",saveUrl,passport.authenticate('local', { failureRedirect: '/listing/user/login',failureFlash:true }),asyncwrap(async(req,res)=>{
	req.flash("success","Welcome back to Wanderlust");
	res.send(res.locals.url);
}))

router.post("/new",asyncwrap(async(req,res)=>{
	try{
	let {username,password,email} = req.body
	const user = new User({username,email})
	const re = await User.register(user,password);
	console.log(re)
	req.flash("success","Welcome to Wanderlust")
	res.redirect("/listing")
}
catch(er){
	req.flash("error",er.message)
	res.redirect("/listing/user/new")
}
}))


router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("success","Logout Successfully")

    res.redirect('/listing');
  });
});
module.exports = router;