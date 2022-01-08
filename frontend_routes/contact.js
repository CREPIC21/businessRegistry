const express = require('express');

const { getContact, postContact } = require('../frontend_controllers/contact');

const router = express.Router();

router.get('/', getContact);
router.post('/', postContact);

module.exports = router;