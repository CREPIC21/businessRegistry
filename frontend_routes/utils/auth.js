const express = require('express');

const { auth } = require('../../frontend_controllers/utils/auth');

const router = express.Router();

router.route('/').post(auth);
router.route('/:registrationid').post(auth);

module.exports = router;