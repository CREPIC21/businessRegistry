const express = require('express');

const { subscribe } = require('../../frontend_controllers/utils/subscribe');

const router = express.Router();

router.get('/:email', subscribe);

module.exports = router;