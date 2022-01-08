const express = require('express');

const { removeCartItem } = require('../../frontend_controllers/utils/removeCartItem');

const router = express.Router();

router.get('/:itemname', removeCartItem);

module.exports = router;