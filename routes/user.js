const express = require('express');
const router = express.Router();
const asyncwrap = require("../utils/asyncwrap");


router.get("/new",asyncwrap(async(req,res)=>{
	res.render("listing/signup.ejs")
}))

module.exports = router;