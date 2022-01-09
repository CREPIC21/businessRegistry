const express = require('express');

const { getApiDocs } = require('../frontend_controllers/api');

const router = express.Router();

router.get('/', getApiDocs);

module.exports = router;