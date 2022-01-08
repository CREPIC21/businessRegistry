const asyncHandler = require('../middelware/async');

// logout functionality
exports.logout = asyncHandler( async (req, res, next) => {
    req.session.loggedin = false;
	req.session.username = undefined;
    res.redirect("/login");
});