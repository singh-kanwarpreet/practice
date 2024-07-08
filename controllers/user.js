const User = require('../model/listing/user');

module.exports.Signupform = (req, res) => res.render("listing/signup.ejs");

module.exports.loginForm = (req, res) => res.render("listing/login.ejs");

module.exports.login = (req, res) => {
	req.flash("success", "Welcome back to Wanderlust");
	res.redirect(res.locals.url);
};

module.exports.signUp = async (req, res) => {
	try {
		let { username, password, email } = req.body;
		const user = new User({ username, email });
		const re = await User.register(user, password);
		req.login(user, function(err) {
			if (err) { return next(err); }
			req.flash("success", "Welcome to Wanderlust");
			res.redirect("/listing");
		});
	} catch (er) {
		req.flash("error", er.message);
		res.redirect("/listing/user/new");
	}
};

module.exports.logOut = (req, res, next) => {
	req.logout(function(err) {
		if (err) { return next(err); }
		req.flash("success", "Logout Successfully");
		res.redirect('/listing');
	});
};
