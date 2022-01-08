const asyncHandler = require('../middelware/async');
const Trade = require('../models/Trade')

// Home page displaying all trades - if user logged in he will see all trades
exports.getHome = asyncHandler( async (req, res, next) => {
    Trade.find({}, function(err, result) {
        if(!err) {
            res.render('home', {allTrades: result, user: req.session.loggedin});
            console.log(req.session.username);
        }
    });
});