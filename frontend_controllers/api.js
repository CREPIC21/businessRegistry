const asyncHandler = require('../middelware/async');

// API documentation page
exports.getApiDocs = asyncHandler( async(req, res) => {
    res.render('api');
})