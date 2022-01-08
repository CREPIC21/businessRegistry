const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Trade = require('../models/Trade');
const Review = require('../models/Review');
const asyncHandler = require('../middelware/async');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/trades/:tradeId/reviews
// @access  Public

exports.getReviews = asyncHandler(async (req, res, next) => {

    // get all reviews for specific trade
    if(req.params.tradeId) {
        const reviews = await Review.find({ trade: req.params.tradeId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    // get all reviews
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    GET single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) =>  {

    const review = await Review.findById(req.params.id).populate({
        path: 'trade',
        select: 'name description'
    });

    // In this if statement we have to make sure to "return" response as we have another response after if statement
    // this is for if the correctly formated ID in the request is not found in the database
    if(!review) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse class in utils
        return next(new ErrorResponse(`Review not found with ID of ${req.params.id}.`, 404));
}

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Add new review
// @route   POST /api/v1/trades/:tradeId/reviews -> using rerouting functionality from router/trades.js
// @access  Private - need to be logged in or send a token
exports.createReview = asyncHandler(async (req, res, next) =>  {

    // we are assinging tradeId from the request to our body that will be sent later when creating a new review
    req.body.trade = req.params.tradeId;
    // we are assinging userID from the request to our body that will be sent later when creating a new review
    req.body.userID = req.user.id;

    // checking if a trade exists in DB
    const trade = await Trade.findById(req.params.tradeId);

    if(!trade) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse class in utils
        return next(new ErrorResponse(`Trade not found with ID of ${req.params.tradeId}.`, 404));
    }

    // if the trade exists in DB then we are creating a new review associated with that trade
    const review = await Review.create(req.body);

    res.status(201).json({
    success: true,
    data: review
    });
});

// @desc    Update review
// @route   DELETE /api/v1/reviews/:id
// @access  Private - need to be logged in or send a token
exports.updateReview = asyncHandler(async (req, res, next) =>  {

    // checking if a review exists in DB
    let review = await Review.findById(req.params.id);

    if(!review) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse class in utils
        return next(new ErrorResponse(`Review not found with ID of ${req.params.id}.`, 404));
    }

    // Validate/check that the current user is review publisher that is being updated or user is admin
    if(review.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        return next(new ErrorResponse('Not authorized to update review.', 401));
    };

    // if the review exists in DB then we are updating the review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
    success: true,
    data: review
    });
});

// @desc    Delete review
// @route   PUT /api/v1/reviews/:id
// @access  Private - need to be logged in or send a token
exports.deleteReview = asyncHandler(async (req, res, next) =>  {

    const review = await Review.findById(req.params.id);

    if(!review) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse classin utils
        return next(new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404));
    }

    // Validate/check that the current user is proffesion owner that is being updated
    if(review.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        return next(new ErrorResponse(`User with ${req.user.id} ID is not authorized to preform this action.`, 401));
    };

    await review.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});