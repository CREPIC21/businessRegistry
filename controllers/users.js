const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middelware/async');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler( async (req, res, next) => {

    const users = await User.find({});

    if(!users) {
        return next(new ErrorResponse('No users in database.', 400));
    }

    res.status(200).json({
        success: true,
        count: users.length,
        users: users
    });   

    // we can just use one line of code to accomplish above
    // res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler( async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse('No users in database.', 400));
    }

    res.status(200).json({
        success: true,
        data: user
    });   
});

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncHandler( async (req, res, next) => {

    const newUser = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: newUser
    });   
});

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler( async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });   
});

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler( async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });   
});