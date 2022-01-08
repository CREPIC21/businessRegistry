const express = require('express');

const { getTrade, getTradeProffesions } = require('../frontend_controllers/trade');

const router = express.Router();

router.route('/:id').get(getTrade);
router.route('/:id/proffesions').get(getTradeProffesions);

module.exports = router;