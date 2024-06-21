const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const asyncwrap = require("./utils/asyncwrap");
const {Rschema} = require("./utils/data_validate");
const ExpressError = require("./utils/ExpressError");
const Review = require("./model/listing/review");
const listing = require('./routes/listing');

app.use("/listing",listing);

const reviewValidate =  async(req, res, next) => {
    
    const result = await Rschema.validate(req.body.review);

    if (result.error) {
next(new ExpressError(400, result.error.details[0].message)); 
    } else {
        next(); 
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
        await mongoose.connect('mongodb://127.0.0.1:27017/book');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
main();

// Routes


//review add

// Add review to a listing
app.post("/listing/:id/review", reviewValidate, asyncwrap(async (req, res, next) => {
    const id = req.params.id;
    const re = await new Review({...req.body.review});
    const list = await listing.findById(id);
    list.review.push(re);
    await re.save();
    await list.save();
    res.status(201).json({ message: 'Review added successfully', reviewId: re._id });
}));


// Delete review
app.delete('/:id/reviews/:rid', asyncwrap(async (req, res) => {
    const { id, rid } = req.params;

 
    await listing.findByIdAndUpdate(
        id,
        { $pull: { review: rid } }
    );

    await Review.findByIdAndDelete(rid);

    return res.redirect(`/${id}`);
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


