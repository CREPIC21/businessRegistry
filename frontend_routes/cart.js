const express = require('express');

const { getCart, pay, paymentSuccess, paymentCanceled } = require('../frontend_controllers/cart');

const router = express.Router();

router.get('/', getCart);
// router.post('/', postCart);
router.post('/', pay);
router.get('/success', paymentSuccess);
router.get('/cancel', paymentCanceled);

module.exports = router;