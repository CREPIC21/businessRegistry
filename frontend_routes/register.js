const express = require('express');

const { getRegister, postRegister } = require('../frontend_controllers/register');

const router = express.Router();

router.get('/', getRegister);
router.post('/', postRegister);

module.exports = router;