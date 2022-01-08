const express = require('express');

const { getLandingPage } = require('../frontend_controllers/landingPage');

const router = express.Router();

router.get('/', getLandingPage);

module.exports = router;