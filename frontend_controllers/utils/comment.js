const asyncHandler = require('../../middelware/async');
const User = require('../../models/User');
const Review = require('../../models/Review');

// Adding a comment on /trade/:tradeid page
exports.postComment = asyncHandler( async(req, res, next) => {
    const user = await User.findOne({ email: req.session.username});

    // extracting trade ID from the URL
    let headerTradeID = req.headers.referer;
    let tradeID = headerTradeID.split("/");
    tradeID = tradeID[tradeID.length - 1];

    req.body.trade = tradeID;
    req.body.userID = user._id;

    await Review.create(req.body);

    // res.render('home', {user: req.session.loggedin});
    return res.redirect('/home');
})