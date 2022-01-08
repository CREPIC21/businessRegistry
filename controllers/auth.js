const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middelware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler( async (req, res, next) => {

    // using destructuring to extract nessesary data from the request body - for registering the user we need name, email, password and user role
    const { name, email, password, userRole } = req.body;

    // create new user
    const newUser = await User.create({
        name,
        email,
        password,
        userRole
    });

    // // later changed to create token below functionality
    // res.status(200).json({success: true});

    // // Create token - as we are using a method from the model we are calling it in acctual user(newUser created) and not on the model User
    // // later changed to below functionality as we are creating a cookie
    // const token = newUser.getSignedJwtToken();

    // res.status(200).json({
    //     success: true,
    //     token: token
    // });

    // now it will send a cookie with the token inside
    sendTokenResponse(newUser, 200, res);    
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler( async (req, res, next) => {

    // using destructuring to extract nessesary data from the request body - for login we need only email and password
    const { email, password } = req.body;

    // Check/validate email and password
    if(!email || !password) {
        return next(new ErrorResponse('Provide email and password', 400));
    }

    // Check for user
    // as we made password field excluded in User model, here we need to check the password with a value
    // https://www.curtismlarson.com/blog/2016/05/11/mongoose-mongodb-exclude-select-fields/
    const user = await User.findOne({ email: email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials, email not found', 401));
    }

    // Validation/check for password match -> comparing password entered by the user on login with password in DB
    const passMatch = await user.checkUserPassword(password);
    if(!passMatch) {
        return next(new ErrorResponse('Invalid credentials, invalid password', 401));
    }

    // // later changed to create token below functionality
    // res.status(200).json({success: true});

    // Create token - as we are using a method from the model we are calling it in acctual user(newUser created) and not on the model User
    // later changed to below functionality as we are creating a cookie
    // const token = user.getSignedJwtToken();
    // res.status(200).json({
    //     success: true,
    //     token: token
    // });

    sendTokenResponse(user, 200, res);
    
});

// @desc    Log user out and clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // we have access to res.cookie() because of cookie-parser middelware
    res.cookie('token', 'none', {
        // setting the cookie to expire in 10 seconds
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Update user details - just name and email
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    // Getting name and email for updating the DB from req.body
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    // adding select('+password') so that we will get password back as well as by default in User model password will not be send back when querying the DB
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if(!(await user.checkUserPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Incorrect current password', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    // if everything checks and the new password is set we will send a token as a response
    sendTokenResponse(user, 200, res);

    // res.status(200).json({
    //     success: true,
    //     data: user
    // });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorResponse(`User with email: ${req.body.email} does not exist in DB.`, 404));
    }

    // Get reset token - we are using method that we created inside our User Model
    const resetToken = user.getResetPasswordToken();

    console.log(resetToken);

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const msg = `You are receiving this email because you (or someone) else has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message: msg
        });

        res.status(200).json({ success: true, data: 'Email send' })
    } catch (error) {
        // if something goes wrong while sending the email we want to set 
        console.log(error);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // https://stackoverflow.com/questions/44912281/how-validation-works-in-mongoose
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    // get hashed token - imported crypto for that
    const resetPassToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    // find the user in DB by the encrypted token
    const user = await User.findOne({
        resetPasswordToken: resetPassToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password for user
    user.password = req.body.password
    // when we set the fields in DB to undefined they just go away from the DB
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // if everything checks and the new password is set we will send a token as a response
    sendTokenResponse(user, 200, res);

    // res.status(200).json({
    //     success: true,
    //     data: user
    // })
})


// Get token from Model, create cookie and create response - helper function
// here we need access to: user, status code, response object
const sendTokenResponse = (user, statusCode, res) => {

    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        // set expiration of the cookie - we want to set it to the same expiration as JWT
        // testing in the console to get the date 30 days from now
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        // as we are in developement mode we want the secure option to be false in the response - we can see it in cookie tab in Postman
        httpOnly: true,
    };

    // if we are in production mode we want to set secure option to true so it will work for 'https' as well
    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        });
}