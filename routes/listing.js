const express = require('express');
const router = express.Router({mergeParams:true});
const asyncwrap = require("../utils/asyncwrap");
const {schema} = require("../utils/data_validate");
const ExpressError = require("../utils/ExpressError");
const listing = require("../model/listing/listing");


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
router.get("/new/form", asyncwrap((req, res) => {
    res.render("listing/create_new.ejs");
}));

// Create new item
router.post("/new/",schemaValidate, asyncwrap(async (req, res, next) => {
   	
   	const data = req.body.listing;
    const re = await new listing({...data});
    await re.save();
    res.redirect("/listing");
}));

// Show individual item
router.get("/:id", asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id).populate('review');
    res.render("listing/individual_listing.ejs",{data});
}));

// Show form to update individual item
router.get("/:id/update", asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    res.render("listing/update_listing.ejs", { data });
}));

// Update individual item
router.put("/:id",schemaValidate, asyncwrap(async (req, res) => {
	res.send("hello")
    // const { id } = req.params;
    // const up = req.body.listing;
    // await listing.findByIdAndUpdate(id, { ...up });
    // res.redirect(`/listing/${id}`);
}));

// Delete individual item
router.delete("/:id/delete", asyncwrap(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
   return res.redirect("/listing");
}));

module.exports = router;
