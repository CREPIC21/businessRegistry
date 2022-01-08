const express = require('express');

const { addItemToCartBtn } = require('../../frontend_controllers/utils/addItemToCart');

const router = express.Router();

router.get('/:proffesionTitle', addItemToCartBtn);

module.exports = router;