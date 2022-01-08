const express = require('express');
const { getProffesions, getProffesion, createProffesion, updateProffesion, deleteProffesion } = require('../controllers/proffesions');

// including middelware for advanced search results
const advancedResults = require('../middelware/advancedResults');

// bringing the Trades model as we will use middelware for advanced results
const Proffesion = require('../models/Proffesion');

// added "mergeParams: true" parameter to router as we are rerouting from routes/tradess.js when adding tradeId to get list of courses for that trade
const router = express.Router({ mergeParams: true });

// added middelware to protect routes that require authentication and authorization
const { protect, authorize } = require('../middelware/auth');

router
    .route('/')
    .get(advancedResults(Proffesion, {
        path: 'trade',
        select: 'name description businessType'
    }), getProffesions)
    // authorize has to be after protect as we are setting the user in protect middelware
    .post(protect, authorize('publisher', 'admin'), createProffesion);
    

router 
    .route('/:id')
    .get(getProffesion)
    // authorize has to be after protect as we are setting the user in protect middelware
    .put(protect, authorize('publisher', 'admin'), updateProffesion)
    // authorize has to be after protect as we are setting the user in protect middelware
    .delete(protect, authorize('publisher', 'admin'), deleteProffesion);
    


module.exports = router;