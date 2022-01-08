const express = require('express');

const { getRegister, postRegister, confirmRegistration } = require('../frontend_controllers/confirmRegistration');

const router = express.Router();

router.route('/:registrationid').get(confirmRegistration);

module.exports = router;