const express = require('express');
const router = express.Router();
const asyncwrap = require("../utils/asyncwrap");
const User = require('../model/listing/user');
const passport = require("passport");
const { saveUrl } = require("../middleware/auth");
const userCode = require("../controllers/user");


router.route("/new")
.get(userCode.Signupform)
.post(asyncwrap(userCode.signUp));

router.route("/login")
.get(userCode.loginForm)
.post(

  saveUrl,
  passport.authenticate('local', {
    failureRedirect: '/listing/user/login',
    failureFlash: true
  }),
  userCode.login
);

router.get('/logout', userCode.logOut);

module.exports = router;
