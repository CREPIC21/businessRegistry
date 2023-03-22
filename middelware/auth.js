const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes - authorization
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // grabbing the token from the headers and checking if authorization starts with 'Bearer'
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // removing the word 'Bearer' as we only need the token part
        console.log(req.headers.authorization)
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // if the authorization in Postman is not set to "Bearer Token" we can still use protected routes as once we login the cookie token is also created and it is sent with every request
    // we can comment out the cookie option and use only authorization option in Postman with "Bearer Token"
    // Set token from cookie
    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }

    // Confirm that the token exists
    if(!token) {
        return next(new ErrorResponse('Authorization needed to access this route', 401));
    }

    // Validate the token
    try {
        // Getting the object that contains user ID and comparing it with the one that we stored in our DB for that user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('From validate the token ', decoded);

        // decoded object has an user id which we will use to find the user
        req.user = await User.findById(decoded.id);

        next();

    } catch (error) {
        return next(new ErrorResponse('Autorization needed to acces this route', 401));
    }
    
});

// Middelware to grant access to specific roles - authentication
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.userRole)) {
            return next(new ErrorResponse(`${req.user.userRole} role is not authorized to access this route.`, 403));
        }
        next();
    }
}