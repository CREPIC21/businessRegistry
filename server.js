const express = require('express');
// loads environment variables from a .env file into process.env. 
const dotenv = require('dotenv');
// Package for logging requests to console (each request made in Postman will be logged to the console)
const morgan = require('morgan');
// Package for formating messages in the console
const colors = require('colors');
const errorHandler = require('./middelware/error');
const connectDB = require('./config/db');
// express middleware for uploading files
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Load env variables from config.env file
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files - backend
const trades = require('./routes/trades');
const proffesions = require('./routes/proffesions');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Route files - frontend
const landingPage = require('./frontend_routes/landingPage');
const register = require('./frontend_routes/register');
const confirmRegistration = require('./frontend_routes/confirmRegistration');
const login = require('./frontend_routes/login');
const home = require('./frontend_routes/home');
const trade = require('./frontend_routes/trade');
const cart = require('./frontend_routes/cart');
const contact = require('./frontend_routes/contact');
const logout = require('./frontend_routes/logout');
const apiDocs = require('./frontend_routes/api');

const comment = require('./frontend_routes/utils/comment');
const removeCartItem = require('./frontend_routes/utils/removeCartItem');
const addCartItem = require('./frontend_routes/utils/addCartItem');
const addItemToCartBtn = require('./frontend_routes/utils/addItemToCart');
const authFrontend = require('./frontend_routes/utils/auth');

// Initialize the app
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Body parser - we need to add this middelware so we can use "req.body" to get data from the requests
// It works only if I add JSON.stringify, example: JSON.stringify(req.body)
app.use(express.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser());

// Dev logging middelware - we only want this to run in developement enviroment, for each request that we made in Postman it will log that request, for example "DELETE /api/v1/trades/1 200 2.514 ms - 42"
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
// app.use(helmet());

// Prevent XSS attackts
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    // setup for 100 API calls in 10 minutes
    windowMs: 10 * 60 * 1000,
    max: 5000
});
app.use(limiter);

// Prevent http param polution
app.use(hpp());

// Enable CORS - once we upload our app to domain and then if we create a frontend application on a different domain we will be able to comunnicate with our API
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Mount routers - backend
// this will add '/api/v1/trades' to all routes in the router as all routes begin with that 
app.use('/api/v1/trades', trades);
app.use('/api/v1/proffesions', proffesions);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Mount routers - frontend
app.use('/', landingPage);
app.use('/register', register);
app.use('/confirmregistration', confirmRegistration);
app.use('/login', login);
app.use('/home', home);
app.use('/trade', trade);
app.use('/cart', cart);
app.use('/contact', contact);
app.use('/logout', logout);
app.use('/api', apiDocs);

app.use('/comment', comment);
app.use('/removeitem', removeCartItem);
app.use('/additem', addCartItem);
app.use('/addToCart', addItemToCartBtn);
app.use('/auth', authFrontend);


/* IMPORTANT */
// to use middelware error.js in trades.js controller it has to be placed right here below "Mount routers", because middelware is executed in linear order
app.use(errorHandler);

// using process.env because we configured env variables in config file
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` .magenta.bold));

// Handle unhandled promise rejections - for example it will throw error message if we made a POST request with the same name that already exists in database
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}` .red);
    // Close server and exit process
    server.close(() => process.exit(1));
});