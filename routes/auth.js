const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');

const router = express.Router();

// Include other resource routers
const proffesionRouter = require('./users');

// added middelware to protect routes that require authentication
const { protect } = require('../middelware/auth');

// Re-route into other resource routers -> in this case when the route is "/api/v1/auth/users" it will reroute the request to router/users.js
router.use('/users', proffesionRouter);

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

router.get('/me', protect, getMe);
router.get('/logout',protect, logout);

module.exports = router;