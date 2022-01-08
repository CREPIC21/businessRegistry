const express = require('express');

const { addCartItem } = require('../../frontend_controllers/utils/addCartItem');

const router = express.Router();

router.get('/:itemname', addCartItem);

module.exports = router;