require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const User = require('./model/listing/user')
const methodOverride = require('method-override');
const asyncwrap = require("./utils/asyncwrap");
const ExpressError = require("./utils/ExpressError");
const listingRoute = require('./routes/listing');
const reviewsRoute = require('./routes/reviews');
const userRoute = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60,
    maxAge: 7*24*60*60,
    httpOnly: true
  }
} 


// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Middleware     // schemaValidate, asyncwrap(listingCode.postNew)


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs-mate'));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.auth = req.user; 
    next();
})


app.use("/listing",listingRoute);
app.use("/listing/:id/review",reviewsRoute);
app.use("/listing/user",userRoute);

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

// 404 Error handling
app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found");
});

// Global error handler
app.use((err, req, res, next) => {

        let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listing/error",{message});
    console.log(err)
});


