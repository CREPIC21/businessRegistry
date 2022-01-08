const asyncHandler = require('../middelware/async');

// Confirm registration view after the user clicks on the registretion link recieved in the email
exports.confirmRegistration = asyncHandler( async(req, res, next) => {
    const errorMessage = req.flash('msg1');
    console.log(req.params.registrationid);
    res.render('confirmRegistration', {userToken: req.params.registrationid, errors: errorMessage});
})

