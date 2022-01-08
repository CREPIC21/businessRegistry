const express = require('express');

const { getCart, postCart } = require('../frontend_controllers/cart');

const router = express.Router();

router.get('/', getCart);
router.post('/', postCart);

module.exports = router;