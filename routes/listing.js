const express = require('express');
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap");
const {schema} = require("../utils/data_validate");
const ExpressError = require("../utils/ExpressError");
const listing = require("../model/listing/listing");
const {auth} = require("../middleware/auth.js")


const schemaValidate =  async(req, res, next) => {
	
    const result = await schema.validate(req.body.listing);

    if (result.error) {
next(new ExpressError(400, result.error.details[0].message)); 
    } else {
        next(); 
    }
    

};


// Root route - list all items
router.get("/", asyncwrap(async (req, res) => {
    const data = await listing.find();
    res.render("listing/listing.ejs", { data });
}));

// Show form to create new item
router.get("/new/form", auth,asyncwrap((req, res) => {

        res.render("listing/create_new.ejs");
    
    
}));

// Create new item
router.post("/new/",schemaValidate, asyncwrap(async (req, res, next) => {
   	
   	const data = req.body.listing;
    const re = await new listing({...data});
    await re.save();
    req.flash("success","New Listing Added");
    res.redirect("/listing");
}));

// Update individual item
router.put("/:id",schemaValidate, asyncwrap(async (req, res) => {
    if (req.user) {
        const { id } = req.params;
    const up = req.body.listing;
   const listing =  await listing.findByIdAndUpdate(id, { ...up });
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
    } else {
        res.redirect("/listing/user/login");
    }
    
}));

// Delete individual item
router.delete("/:id/delete", asyncwrap(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
   return res.redirect("/listing");
}));

// Show individual item
router.get("/:id", asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id).populate('review');
    if (!data) {
        req.flash("error","Listing you requested does not exist")
        res.redirect("/listing")
    } else {
     res.render("listing/individual_listing.ejs",{data});   
    }
    
}));

// Show form to update individual item
router.get("/:id/update",auth, asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    if (!data) {
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listing");
    } else {
        res.render("listing/update_listing.ejs", { data });
    }
    
}));



module.exports = router;
