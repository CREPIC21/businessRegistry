// server framework for Node.js.
const express = require('express');
// loads environment variables from a .env file into process.env. 
const dotenv = require('dotenv');
// package for logging requests to console (each request made in Postman will be logged to the console)
const morgan = require('morgan');
// package for formating messages in the console
const colors = require('colors');
// middelware foer handling error messages
const errorHandler = require('./middelware/error');
// connection to MongoDB
const connectDB = require('./config/db');
// express middleware for uploading files
const fileUpload = require('express-fileupload');
// module that allows us to interact with file paths easily
const path = require('path');
// middleware which parses cookies attached to the client request object
const cookieParser = require('cookie-parser');
// middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection - https://www.npmjs.com/package/express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require('helmet');
// middleware to sanitize user input coming from POST body, GET queries, and url params
const xss = require('xss-clean');
// middleware for Express used to limit repeated requests to public APIs and/or endpoints such as password reset
const rateLimit = require('express-rate-limit');
// middleware to protect against HTTP Parameter Pollution attacks
const hpp = require('hpp');
// mechanism to allow or restrict requested resources on a web server depend on where the HTTP request was initiated
const cors = require('cors');
// simple templating language which is used to generate HTML markup with plain JavaScript
const ejs = require('ejs');
// allows express to read the body and then parse that into a Json object that we can understand
const bodyParser = require('body-parser');
// an HTTP server-side framework used to create and manage a session middleware
const session = require('express-session');
// library which allows you to flash messages
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
const subscribed = require('./frontend_routes/utils/subscribe');

// const payPalRoute = require('./frontend_routes/pay');

// Initialize the app
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Body parser - we need to add this middelware so we can use "req.body" to get data from the requests
// It works only if I add JSON.stringify, example: JSON.stringify(req.body)
app.use(express.json());

// https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Body parser
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

// Flash messages
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
app.use('/subscribed', subscribed);

// app.use('/pay', payPalRoute);


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