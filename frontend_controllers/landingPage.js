const asyncHandler = require('../middelware/async');

// Display home page(landing page) - user not logged in
exports.getLandingPage = asyncHandler( async (req, res, next) => {
    res.render('landingPage', {user: req.session.loggedin});
});