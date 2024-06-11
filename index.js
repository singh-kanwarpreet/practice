const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const asyncwrap = require("./utils/asyncwrap");
const schema = require("./utils/data_validate");
const ExpressError = require("./utils/ExpressError");
const listing = require("./model/listing/listing");

const schemaValidate = async (req, res, next) => {
	
    const result = await schema.validate(req.body.listing);

    if (result.error) {
next(new ExpressError(400, result.error.details[0].message)); 
    } else {
        next(); // Proceed to the next middleware
    }
    

};




// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs-mate'));

// Database connection
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
main();

// Routes
// Root route - list all items
app.get("/listing", asyncwrap(async (req, res) => {
    const data = await listing.find();
    res.render("listing/listing.ejs", { data });
}));

// Show form to create new item
app.get("/listing/new/form", asyncwrap((req, res) => {
    res.render("listing/create_new.ejs");
}));

// Create new item
app.post("/listing/new/",schemaValidate, asyncwrap(async (req, res, next) => {
   	
   	const data = req.body.listing;
    const re = await new listing({...data});
    await re.save();
    res.redirect("/listing");
}));

// Show individual item
app.get("/listing/:id", asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    res.render("listing/individual_listing.ejs", { data });
}));

// Show form to update individual item
app.get("/listing/:id/update", asyncwrap(async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    res.render("listing/update_listing.ejs", { data });
}));

// Update individual item
app.put("/listing/:id",schemaValidate, asyncwrap(async (req, res) => {
    const { id } = req.params;
    const up = req.body.listing;
    await listing.findByIdAndUpdate(id, { ...up });
    res.redirect(`/listing/${id}`);
}));

// Delete individual item
app.delete("/listing/:id/delete", asyncwrap(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// 404 Error handling
app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found");
});

// Global error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listing/error",{message});
});


