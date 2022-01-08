const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

// added "mergeParams: true" parameter to router as we are rerouting from routes/auth.js when adding auth routes path
const router = express.Router({ mergeParams: true });

// added middelware to protect routes that require authentication and authorization
const { protect, authorize } = require('../middelware/auth');
// including middelware for advanced search results
const advancedResults = require('../middelware/advancedResults');

// bringing the Trades model as we will use middelware for advanced results
const User = require('../models/User');

//// instead of adding protect and authorize middelware to eac route we can just use below
// router.use(protect);
// router.use(authorize('admin'));

router.get('/', advancedResults(User), protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);

router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;