const asyncHandler = require('../middelware/async');

// Login page view
exports.getLogin = asyncHandler( async(req,res,next) => {
    const errorMessage = req.flash('msg1');
    // if user is logged in and tries to access login route we will redirect him to the home page
    if(req.session.loggedin) {
        return res.redirect('/home');
    }
    res.render('login', {user: req.session.loggedin, errors: errorMessage});
})