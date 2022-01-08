const express = require('express');

const { getHome } = require('../frontend_controllers/home');

const router = express.Router();

router.get('/', getHome);

module.exports = router;