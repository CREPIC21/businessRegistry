const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Trade = require('../models/Trade');
// we need geocoder here as we will extract lat/log 
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middelware/async');
const colors = require('colors');

// @desc    Get all trades
// @route   GET /api/v1/trades
// @access  Public
exports.getTrades = asyncHandler(async (req, res, next) =>  {

        // console.log(req.query);

        // whole section moved to middelware/advancedResults so it can be used in other routes as well
        /*
        // new variable that will be assigned a trade value after advanced filtering
        let query;

        // making a copy of req.query using spread operator
        const reqQuery = { ...req.query };

        // Creating an arroy of fields to exclude from query parameters
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);

        // getting request parameters and creating a query string
        // let queryStr = JSON.stringify(req.query); 
        let queryStr = JSON.stringify(reqQuery); // changed as we made a copy of req.query
        console.log(queryStr);

        // searching for specific parameters and adding "$" sign as per documentation so we can later filter trades database using query numbers 
        // https://docs.mongodb.com/manual/reference/operator/query-comparison/
        // /api/v1/trades?careers[in]=Cook
        // /api/v1/trades?averagePricePerCouple[gte]=15
        // /api/v1/trades?averagePricePerCouple[gte]=15&location.city=Skrzeszewo
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log(queryStr);

        // assiging a trade value based on filter query parameters
        //query = Trade.find(JSON.parse(queryStr));

        // above changed to below as we created reverse virtual to include proffesions associated with the trade to response
        // query = Trade.find(JSON.parse(queryStr)).populate('proffesions');
        query = Trade.find(JSON.parse(queryStr)).populate({
            path: 'proffesions',
            select: 'title description classCost'
        });

        // SELECT FIELDS 
        // we can explicitly set what to get back from the request - "/api/v1/trades?select=name,description"
        // we can combine it with filtering - "/api/v1/trades?select=name,description,hiring&hiring=true"
        // https://mongoosejs.com/docs/queries.html
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            console.log("Fields: ", fields);

            query = query.select(fields);
        }

        // SORT 
        // /api/v1/trades?select=name,description,hiring&sort=name
        // /api/v1/trades?select=name,description,hiring&sort=-name
        // https://mongoosejs.com/docs/queries.html
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');

            query = query.sort(sortBy);
        } else {
            // creatind default sortBy if none is specified in query request
            query = query.sort('-createdAt');
        }

        // PAGINATION
        // /api/v1/trades?limit=2
        // /api/v1/trades?limit=2&select=name
        // /api/v1/trades?page=2&limit=2&select=name
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page -1)*limit;
        const endIndex = page * limit;
        const total = await Trade.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // const trades = await Trade.find();
        const trades = await query;

        // Pagination result
        const pagination = {};

        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page -1,
                limit: limit
            }
        }
        */

        // res.status(200).json({
        //     success: true,
        //     count: trades.length,
        //     pagination,
        //     data: trades
        // });

        // the above changed to below as we created advancedResults middelware, we have access to advancedResults as this route is using that middelware
        res.status(200).json(res.advancedResults);
    });
    
// @desc    GET single trade
// @route   GET /api/v1/trades/:id
// @access  Public
exports.getTrade = asyncHandler(async (req, res, next) =>  {

            const trade = await Trade.findById(req.params.id);

            // In this if statement we have to make sure to "return" response as we have another response after if statement
            // this is for if the correctly formated ID in the request is not found in the database
            if(!trade) {
                // return res.status(400).json({
                //     success: false
                // });

                // changed after creating ErrorResponse class in utils
                return next(new ErrorResponse(`Business not found with ID of ${req.params.id}. Response from try block`, 404));
        }

        res.status(200).json({
            success: true,
            data: trade
        });
    });
    
// @desc    Create new trade
// @route   POST /api/v1/trades/:id
// @access  Private - need to be logged in as admin or send a token
exports.createTrade = asyncHandler(async (req, res, next) =>  {
            // Add userID to req.body(userID in our Trade model that will be associated with the user that created trade) - as user has to be logged to access this route we have acces to req.user.id
            req.body.userID = req.user.id
            console.log(req.body.user);
            console.log(req.user.id);

            // Validate/check if the trade in exists in DB
            const createdTrade = await Trade.findOne({ userID: req.user.id });

            // Validate/check if the user is not an admin, they can only add one trade/business
            if(createdTrade && req.user.userRole !== 'admin') {
                return next(new ErrorResponse(`${req.user.id} user ID already added one trade, to add more trades please contact admin.`, 400));
            }

            console.log("From req.body ".red, req.body);
            const trade = await Trade.create(req.body);

            res.status(201).json({
            success: true,
            data: trade
        });
    });
    
// @desc    Update trade
// @route   PUT /api/v1/trades/:id
// @access  Private - need to be logged in or send a token
exports.updateTrade = asyncHandler(async (req, res, next) =>  {

            let trade = await Trade.findById(req.params.id);

            if(!trade) {
                // return res.status(400).json({
                //     success: false
                // });

                // changed after creating ErrorResponse classin utils
                return next(new ErrorResponse(`Business not found with ID of ${req.params.id}`, 404));
            }

            // Validate/check that the current user is trade owner that is being updated
            if(trade.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
                return next(new ErrorResponse(`User with ${req.user.id} ID is not the owner of trade and cannot make a change.`, 401));
            };

            trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            })

            res.status(200).json({
                success: true,
                data: trade
            });
    });
    
// @desc    Delete trade
// @route   DELETE /api/v1/trades/:id
// @access  Private - need to be logged in or send a token
exports.deleteTrade = asyncHandler(async (req, res, next) =>  {

            // const trade = await Trade.findByIdAndDelete(req.params.id);

            // Above changed to below as we added functionality in Trade Schema once we delete a trade we also want to delete all proffesions associated with that trade
            const trade = await Trade.findById(req.params.id);

            if(!trade) {
                // return res.status(400).json({
                //     success: false
                // });

                // changed after creating ErrorResponse classin utils
                return next(new ErrorResponse(`Business not found with ID of ${req.params.id}`, 404));
            }

            // Validate/check that the current user is trade owner that is being deleted
            if(trade.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
                return next(new ErrorResponse(`User with ${req.user.id} ID is not the owner of trade and cannot delete a trade.`, 401));
            };

            // for functionality of removing proffesions associated with deleted trade we need to run below which will trigger middelware in Trade Schema
            trade.remove();

            res.status(200).json({
                success: true,
                data: {}
            });
    });

// @desc    Get trade within certain radius 
// @route   GET /api/v1/trades/radius/:zipcode/:distance
// @access  Private - need to be logged in or send a token
exports.getTradeInRadius = asyncHandler(async (req, res, next) =>  {

    // extracting the zipcode and distance from request parameters
    const { zipcode, distance } = req.params;

    // getting lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    // Calc radius - we have to get a radius of the earth - devide distance by radius of Earth
    // Earth radius = 3,963 mi / 6,378 km
    const radius = distance / 6378;

    // https://docs.mongodb.com/manual/reference/operator/query/centerSphere/
    const trades = await Trade.find({
        location: { $geoWithin: { $centerSphere: [ [ longitude, latitude ], radius ] } }
    });

    res.status(200).json({
        success: true,
        count: trades.length,
        data: trades
    });
});

// @desc    Upload photo for trade
// @route   PUT /api/v1/trades/:id/photo
// @access  Private - need to be logged in or send a token
exports.tradePhotoUpload = asyncHandler(async (req, res, next) =>  {

    const trade = await Trade.findById(req.params.id);

    if(!trade) {
        // return res.status(400).json({
        //     success: false
        // });

        // changed after creating ErrorResponse classin utils
        return next(new ErrorResponse(`Business not found with ID of ${req.params.id}`, 404));
    }

    // Validate/check that the current user is trade owner where the photo is being uploaded
    if(trade.userID.toString() !== req.user.id && req.user.userRole !== 'admin') {
        return next(new ErrorResponse(`User with ${req.user.id} ID is not the owner of trade and cannot upload a photo.`, 401));
    };

    if(!req.files) {
        return next(new ErrorResponse(`Please uppload a file`, 400));
    }

    // console.log(req.files.file);

    const file = req.files.file

    // Make sure that the image is a photo - checking if the mimetype key/value starts with image
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`This is not an image file, please upload an image file`, 400));
    }

    // Checking the file size - configured in config.env
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Too big file, upload file needs to be less then ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom file name and added it to trade
    // required 'path' so we can get extension of the file and add it dinamicaly to the name 
    file.name = `picture_${trade._id}${path.parse(file.name).ext}`;

    // function attached to file mv() which allows us to move files to desired folders
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(new ErrorResponse(`There is an issue with file upload`, 500));
        }

        await Trade.findByIdAndUpdate(req.params.id, {
            photo: file.name
        });

        res.status(200).json({
            success: true,
            data: file.name
        });

    });
    // console.log(file.name);
    
});