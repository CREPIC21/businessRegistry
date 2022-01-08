const ErrorResponse = require('../utils/errorResponse');
const Proffesion = require('../models/Proffesion');
const Trade = require('../models/Trade');
const asyncHandler = require('../middelware/async');

// @desc    Get list of all proffesions
// @route   GET /api/v1/proffesions
// @route   GET /api/v1/trades/:tradeId/proffesions
// @access  Public

exports.getProffesions = asyncHandler(async (req, res, next) => {

    // get all proffessions for specific trade
    if(req.params.tradeId) {
        const proffesions = await Proffesion.find({ trade: req.params.tradeId});
        return res.status(200).json({
            success: true,
            count: proffesions.length,
            data: proffesions
        })
    // get all proffesions
    } else {
        /*
        // query = Proffesion.find();

        // added populate() - we can display additional data for certain parameter in the response -> in this case trade
        query = Proffesion.find().populate({
            path: 'trade',
            select: 'name description businessType'
        });
        */

        // the above changed to below as we created advancedResults middelware, we have access to advancedResults as this route is using that middelware
        res.status(200).json(res.advancedResults);
    }

});

// @desc    GET single proffesion
// @route   GET /api/v1/proffesions/:id
// @access  Public
exports.getProffesion = asyncHandler(async (req, res, next) =>  {

    const proffesion = await Proffesion.findById(req.params.id).populate({
        path: 'trade',
        select: 'name description'
    });

    // In this if statement we have to make sure to "return" response as we have another response after if statement
    // this is for if the correctly formated ID in the request is not found in the database
    if(!proffesion) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse class in utils
        return next(new ErrorResponse(`Proffesion not found with ID of ${req.params.id}. Response from try block`, 404));
}

    res.status(200).json({
        success: true,
        data: proffesion
    });
});

// @desc    Add new proffesion
// @route   POST /api/v1/trades/:tradeId/proffesions -> using rerouting functionality from router/trades.js
// @access  Private - need to be logged in or send a token
exports.createProffesion = asyncHandler(async (req, res, next) =>  {

    // we are assinging tradeId from the request to our body that will be sent later when creating a new proffesion
    req.body.trade = req.params.tradeId;
    // we are assinging userID from the request to our body that will be sent later when creating a new proffesion
    req.body.userID = req.user.id;

    // checking if a trade exists in DB
    const trade = await Trade.findById(req.params.tradeId);

    if(!trade) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse class in utils
        return next(new ErrorResponse(`Trade not found with ID of ${req.params.tradeId}. Response from try block`, 404));
}

    // Validate/check if the user is owner of the trade where we are adding a proffesion
    if(trade.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        console.log(trade.userID, req.user.id);
        return next(new ErrorResponse(`User with ${req.user.id} ID is not owner of the trade and not authorized to add proffesion to this trade.`, 400));
    }

    // if the trade exists in DB then we are creating a new proffesion associated with that trade
    const proffesion = await Proffesion.create(req.body);

    res.status(201).json({
    success: true,
    data: proffesion
    });
});

// @desc    Update proffesion
// @route   PUT /api/v1/proffesion/:id
// @access  Private - need to be logged in or send a token
exports.updateProffesion = asyncHandler(async (req, res, next) =>  {

    let proffesion = await Proffesion.findById(req.params.id);

    if(!proffesion) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse classin utils
        return next(new ErrorResponse(`Proffesion not found with ID of ${req.params.id}`, 404));
    }

    // Validate/check that the current user is proffesion owner that is being updated
    if(proffesion.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        return next(new ErrorResponse(`User with ${req.user.id} ID is not the owner of the proffesion and cannot make a change.`, 401));
    };

    proffesion = await Proffesion.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });


    res.status(200).json({
        success: true,
        data: proffesion
    });
});

// @desc    Delete proffesion
// @route   DELETE /api/v1/proffesion/:id
// @access  Private - need to be logged in or send a token
exports.deleteProffesion = asyncHandler(async (req, res, next) =>  {

    const proffesion = await Proffesion.findById(req.params.id);

    if(!proffesion) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse classin utils
        return next(new ErrorResponse(`Proffesion not found with ID of ${req.params.id}`, 404));
    }

    // Validate/check that the current user is proffesion owner that is being updated
    if(proffesion.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        return next(new ErrorResponse(`User with ${req.user.id} ID is not the owner of the proffesion and cannot delete.`, 401));
    };

    await proffesion.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});