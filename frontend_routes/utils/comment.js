const express = require('express');

const { postComment } = require('../../frontend_controllers/utils/comment');

const router = express.Router();

router.post('/', postComment);

module.exports = router;