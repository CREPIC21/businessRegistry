const express = require('express');
const { getReviews, getReview, createReview, updateReview, deleteReview } = require('../controllers/reviews');

// added "mergeParams: true" parameter to router as we are rerouting from routes/trades.js when adding tradeId to get list of reviews for that trade
const router = express.Router({ mergeParams: true });

// bringing the Trades model as we will use middelware for advanced results
const Review = require('../models/Review');

// including middelware for advanced search results
const advancedResults = require('../middelware/advancedResults');

// added middelware to protect routes that require authentication and authorization
const { protect, authorize } = require('../middelware/auth');

router.get('/',advancedResults(Review, {
    path: 'trade',
    select: 'name description'
}), getReviews);
router.post('/', protect, authorize('user', 'admin'), createReview);

router.get('/:id', getReview);
router.put('/:id', protect, authorize('user', 'admin'), updateReview);
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);


module.exports = router;