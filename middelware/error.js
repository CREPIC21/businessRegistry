const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;

    // Log to console for developer
    // we can use .red for coloring the messages as we are using color package
    // console.log(err.stack.red);

    // Mongoose bad objectId "CastError" - if the ID is incorrectly formated in the request
    console.log('Logging from error.js: '+ err.name);
    if(err.name === 'CastError') {
        const message = 'Resource not found.';
        error = new ErrorResponse(message, 404);
        console.log('From Mongoose bad object ID', error)
    }

    // Mongoose duplicate key ID - when creating a new bootcamp with POST method
    if(err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 404);
        console.log('From Mongoose Duplicate key ID', error);
    }

    // Mongoose validation error - when creating a new bootcamp with POST method
    if(err.name === 'ValidationError') {
        // Here we are extracting error messages from array of objects "err.errors"
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
        console.log('From Mongoose validation error', error);
    }

    // res.status(500).json({
    //     success: false,
    //     error: err.message
    // });

    // After creating the class ErrorHandler response below modified
    // res.status(err.statusCode || 500).json({
    //     success: false,
    //     error: err.message || 'Server error'
    // });

    // After creating error variable response below modified
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });

}

module.exports = errorHandler;

// since this is middelware we have to run it through app.use() in server.js