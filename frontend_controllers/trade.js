const asyncHandler = require('../middelware/async');
const Trade = require('../models/Trade');
const Review = require('../models/Review');
const User = require('../models/User');
const Proffesion = require('../models/Proffesion');

// Display info for single trade
exports.getTrade = asyncHandler( async(req, res, next) => {
    if(req.session.loggedin) {
        const tradeResult = await Trade.findOne({_id: req.params.id});
        const reviewResults = await Review.find({trade: req.params.id});
        let reviews = [];
    
        let sessionUser = await User.findOne({ email: req.session.username}, 'name');
        let userAlreadyCommented = false;
    
            // getting names of author reviws
            for(let i =0; i < reviewResults.length; i++) {
                const userResult = await User.findOne({_id: reviewResults[i].userID}, 'name');
                console.log(userResult)
    
                // checking if the current user already posted the comment, if he did the form to post comment will not be visible for that user
                if(userResult.name === sessionUser.name) {
                    userAlreadyCommented = true;
                }
    
                let review = {
                title: reviewResults[i].title,
                text: reviewResults[i].text,
                author: userResult.name
                }
                reviews.push(review);           
            }
            res.render('trade', {tradeToRender: tradeResult, reviewToRender: reviews, user: req.session.loggedin, alreadyCommented: userAlreadyCommented});
        } else {
            res.redirect('/home');
        }
});

// Display proffesions for single trade
exports.getTradeProffesions = asyncHandler( async(req, res, next) => {
    if(req.session.loggedin) {
        Proffesion.find({trade: req.params.id}, function(err, result) {
           if(!err) {
               res.render('proffesions', {proffesionsToRender: result, user: req.session.loggedin});
           }
       })
        } else {
            res.redirect('/home');
        }
})