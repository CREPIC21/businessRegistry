const express = require('express');

const { getLogin } = require('../frontend_controllers/login');

const router = express.Router();

router.route('/').get(getLogin);

module.exports = router;