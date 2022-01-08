const express = require('express');
// bringing the routes from controller/trades.js file using destructuring
const { getTrades, getTrade, createTrade, updateTrade, deleteTrade, getTradeInRadius, tradePhotoUpload} = require('../controllers/trades');

// including middelware for advanced search results
const advancedResults = require('../middelware/advancedResults');

// bringing the Trades model as we will use middelware for advanced results
const Trade = require('../models/Trade');

// Include other resource routers
const proffesionRouter = require('./proffesions');
const reviewRouter = require('./reviews');

const router = express.Router();

// added middelware to protect routes that require authentication and authorization
const { protect, authorize } = require('../middelware/auth');

// Re-route into other resource routers -> in this case when the route is "/api/v1/trades/5d713995b721c3bb38c1f5d0/proffesions" it will reroute the request to router/proffesions.js
router.use('/:tradeId/proffesions', proffesionRouter);
// Re-route into other resource routers -> in this case when the route is "/api/v1/trades/5d713995b721c3bb38c1f5d0/reviews" it will reroute the request to router/reviews.js
router.use('/:tradeId/reviews', reviewRouter);

router
    .route('/')
    // adding advancedResults filtering to the route
    .get(advancedResults(Trade, {
        path: 'proffesions',
        select: 'title description classCost'
    }), getTrades)
    // authorize has to be after protect as we are setting the user in protect middelware
    .post(protect, authorize('publisher', 'admin'), createTrade);

router
    .route('/:id')
    .get(getTrade)
    // authorize has to be after protect as we are setting the user in protect middelware
    .put(protect, authorize('publisher', 'admin'), updateTrade)
    // authorize has to be after protect as we are setting the user in protect middelware
    .delete(protect, authorize('publisher', 'admin'), deleteTrade);

router 
    .route('/radius/:zipcode/:distance')
    .get(getTradeInRadius);

router
    .route('/:id/photo')
    // authorize has to be after protect as we are setting the user in protect middelware
    .put(protect, authorize('publisher', 'admin'), tradePhotoUpload);

module.exports = router;