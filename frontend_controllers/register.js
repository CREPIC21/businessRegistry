const asyncHandler = require('../middelware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Register page view
exports.getRegister = asyncHandler( async(req, res, next) => {
    // Creating an 'errorMessage' object which we can use and pass on to create flash messages for validation
    const errorMessage = req.flash('msg1');
    // if user is logged in and tries to access register route we will redirect him to the home page
    if(req.session.loggedin) {
        return res.redirect('/home');
    }
    res.render('register', {user: req.session.loggedin, errors: errorMessage});
})

exports.postRegister = asyncHandler( async(req, res, next) => {
    // using destructuring to extract nessesary data from the request body - for registering the user we need name, email, password and user role
    // const { name, email, password, userRole } = req.body;
    const name = req.body.fullname;
    const email = req.body.email;
    const password = req.body.pwd;

    const user = await User.findOne({ email: email});

    if(!user) {

        try {
            const newUser = await User.create({
                name,
                email,
                password
            });

            const token = newUser.getSignedJwtToken();

            newUser.registrationToken = token;
            newUser.registrationTokenExpire = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
            await newUser.save();

            await sendEmail({
                email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
                subject: 'Business Registry - Registration Confirmation',
                message: `Confirm your registration by clicking on the following link http://localhost:5000/confirmregistration/${token}`
            });
            messageSent =  true;
            req.flash('msg1', `Thank you for registering. Your confirmation email is on the way. Check your mail.`);
            return res.redirect('/register');
            
        } catch (error) {
            // if something goes wrong while sending the email we want to set
            messageSent =  false;
            req.flash('msg1', `Email was not send. Please register again`);
            return res.redirect('/register');
        }
    } else {
        req.flash('msg1', `User with the email ${req.body.email} already exists. Choose another email`);
        res.redirect('/register');
    } 
})