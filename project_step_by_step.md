LET START

- Business Registry application to manage trades, courses/classes, reviews, users and authentication.
- Only business from hospitality industry can register, and they have to provide/offer classes/courses(cooking, bartending, serving,making coffee, making deserts...) as part of their business.

npm init
npm install express dotenv
npm install -D nodemon

- modified package.json for executing the enviroment:
    "scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
  },

- created config file for env variables

- to run the app "npm run dev" -> in development mode
- to run the app "npm start" -> in production mode

- created .gitignore file to not commit certain files when pushing the app on GitHub

- created seperate file for routes trades.js and created router(insted of app)

- created seperate file for all routes in controllers trades.js and exported the to routes trades.js

- created sepeate file for middelware logger.js -> provides logging functionality for an application. It can be used to display errors, warnings and debug messages, but we will use morgan as explained below -> logger later on deleted from the project

- installed third party middelware morgan -> npm install morgan
https://www.npmjs.com/package/morgan
- what is middleware -> https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded

- configured Postman environment & Collections

- created a cluster on mongodb
https://cloud.mongodb.com/v2/614e2d0ab140c35eddd31a8a#clusters

- installed mongodb compas on our local machine and connected to it
https://www.mongodb.com/products/compass

- installed mongoose -> npm install mongoose
- created db.js file in config for connection to database via server.js and env variable for MONGO_URI

- installed colors for estetics of messages in terminal -> npm install colors

- created our first model in models/Trade.js -> exported and imported to controllers/trades.js

- created new trade route (controllers.trades.js)

- did try/catch in controllers.trades.js for create new trade route
- modified GET route for get single trade
- modified the rest of the routes -> GET, POST, UPDATE, DELETE

- created middelware errorHandler which will return json data when request is 500
  - created new middelware error.js
  - imported the middelware to server.js and "IMPORTANT" executed it after "Mount routers"
  - in GET single trade we changed catch configuration to use next(error)
  - testing done in Postman
    - before error handler we would get HTML body with error message when using inproper ID
    - after including error handler we would get back json data error message
    - response below:
      {
      "success": false,
      "error": "Cast to ObjectId failed for value \"614eee3213117f6564e11904kjkjkkj\" (type string) at path \"_id\" for model \"Business\""
      }

    - created custom util errorResponse and formated our custom responses
      - created ErrorResponse class in utils errorResponse.js
      - modified error.js middelware
      - modified error responses in GET single trade in controllers trades.js
      - tested in postman
      - new custom response below
      {
      "success": false,
      "error": "Business not found with ID of 614eee3213117f6564e11904kjkjkkj"
      }


- modified error.js and created error variable and assign it to err values
  - created a condition for "CastError"
  - modified all catch conditions in trades.js to use next(error) - see file in code_changes_history
  - also modified UPDATE and DELETE methods for condition if(!trade) with error handlers

- created error handlers in error.js for "Mongoose duplicate key ID" and "Mongoose validation error"

- cleaned up the code, our try/catch block in trades.js and used async/await middelware
  - https://www.acuriousanimal.com/blog/20180315/express-async-middleware
  - created new middelware async.js and imported it to controlers trades.js
  - cleaned up all try/catch blocks and added asyncHandler to each request - see file in code_changes_history before changes
  - made a copy of controller trades.js in code_changes_history folder so we can have a new clean code

- mongoose middelware & slugify
  - https://mongoosejs.com/docs/middleware.html
  - installed a third party package to create slug -> npm install slugify, and imported it to Trade.js models and created functionality for creating slug field in DB with desired value
    - https://www.npmjs.com/package/slug
    - now we can create slugs automatically when making a POST request using the TradeSchema.pre() - this is great

- GeoJSON Locatopn & Geocoder Hook - MapQuest API
  - https://www.npmjs.com/package/node-geocoder
  - installed geocoder -> npm install node-geocoder
  - created an account on https://developer.mapquest.com/user/me/apps
  - added geocoder provider and geocoder apy key to config.env
  - created new file geocoder.js in utils folder to create geocoder functionality and imported it to Trade.js models
  - created geocoder functionality which will once making a POST request, address parameter will go through geocoder and create a location field in DB with desired key/value pairs

- created seeder.js in root folder which will allow us to quickly seed a DB (import data, delete/destroy data) based on JSON by running commands in terminal, in our case:
  - command "node seeder -im" -> will import the data
  - command "node seeder -dl" -> will delete/destroy the data

- created a new route GET trades by geolocation in controllers/trades.js (geocoder imported as well)
  - https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#definition
  - added the route to routes/trades.js
  - added a route to postman workspace

- created advanced filtering for GET trades in controler/trades.js
  - https://docs.mongodb.com/manual/reference/operator/query-comparison/
  - based on query parameters in URL we can filter by specific data in database: city, careers, averageCost...
  - added "averagePricePerCouple" to database for testing purposes

- created SELECT and SORT filtering for GET trades in controler/trades.js

- created PAGINATION and added pagination field to response for GET trades in controler/trdes.js

- created new model LearnProffesion.js and exported it
  - added trades.json testing data
  - as well adjusted seeder.js when importing/destroying DB to include learnProffesion.js

- created proffesions routes and controller
  - created controllers/proffesions.js -> added route to get all proffesions as well route to get specific proffesions for specific trade
  - created routes/proffesions.js for getProffesions route
    - added "mergeParams: true" parameter to router as we are rerouting from routes/trades.js when adding tradeId to get list of proffesions for that trade
  - modified routes/trades.js
    - we included other resource routers -> routers/proffesions.js
    - we re-route to routers/proffesions.js when using tradeId in request parameters
  - modified server.js
    - added proffesions to "Route files" as well to "Mount routers"
  - created "Proffesions" folder in Postman and added routes for GET proffesions and GET proffesions for specific trade

- added populate() to controllers/proffesions.js to getProffesions request -> cool feature
  - https://mongoosejs.com/docs/populate.html

- added populate() to controllers/trades.js to getTrades request to get proffesions associated with this trade -> cool feature
  - modified models/Trade.js and added reverse virtual so we can get a list of proffesions associated with this trade when making GET request to get all trades

- added additional functionality once when we delete trade to also delete proffesions associated to that trade
 - created middelware in model/Trade.js for removing proffesions once trade is deleted
 - modified controllers/trades.js DELETE request
  - changed findByIdAndDelete() to findById()
  - added bootcamp.remove() for functionality to work

- created a route for GET single proffesion in controllers/proffesions.js and added route to routes/proffesions.js

- created a route for POST proffesion in controllers/proffesions.js and added route to routes/proffesions.js

- created routes for UPDATE and DELETE proffesions in controllers/proffesions.js and added routes to routes/proffesions.js

- calculating avarege cost of course proffesion
  - database deleted
  - seeder run without proffesions
  - added "avaregeProffesionsPrice" to Trade Model
  - static method created which runs directly on the Proffesion Model getAvaregeCost()
  - two middelware created in Proffesion Model to calculate avarege cost of all proffesion classes for specific trade

- adding photo upload to trades
  - database deleted
  - seeder run normally
  - installed express-fileupload
    - https://www.npmjs.com/package/express-fileupload
    - imported to server.js and added as a middelware to app.use(fileUpload());
  - route for upload photo created in controllers/trades.js and route added to routes/trades.js
  - uploaded image via Postman
    - body -> form-data
      - key: file (file)
      - value: upload photo
  - created new enc in config.env
    - FILE_UPLOAD_PATH and MAX_FILE_UPLOAD
  - added validation to upload image route
  - required 'path' to controllers/trades.js for file manipulation
  - created new public/uploads folder where the images will be saved once send via API
    - modified server.js
      - required 'path' and 'express-fileupload' and set static folder

- created super middelware/advancedResults middelware for filtering that can be used in different routes
  - created middelware in middelware/advancedResults
  - modified GET all trades route in controllers/trades.js -> very simplified
  - modified routes/trades.js to use model Trade and super advanced middelware
  - modified routes/proffesions.js to use model Proffesion and super advanced middelware
  - modified GET all proffesions route in controllers/proffesions.js -> very simplified

- created views and partails folders for frontend
- modified server.js to use ejs view engine
- created frontend folder for frontend routes
- created GET route for home page -> just testing
- added route to route files and mount routers in server.js

- installed jsonwebtoken
  - https://www.npmjs.com/package/jsonwebtoken
- installed bcryptjs
 - https://www.npmjs.com/package/bcryptjs
- created a User Model Schema in models/User.js
- created route for authentication in controllers/auth.js, added route to routes/auth.js and modified server.js(route files and mount routers)
- created REGISTER route in contrellers/auth.js and added route to routes/auth.js
- using bcrypt middelware we encrypted user password -> middelware run before saving the user in DB -> middelware added in model/User.js
- created a method for creating JWT in models/User.js which we use in controllers/auth.js
  - https://www.npmjs.com/package/jsonwebtoken
  - https://jwt.io/
  - configured ENV for JWT and expiry of JWT in config/config.env -> remember to restart the server every time when making changes in config.env
  - once we do a request in Postman we can copy/paste the token in https://jwt.io/ and see the payload data
    - "id" in payload data is "_id" of the user in our database

- created LOGIN route contrellers/auth.js and added route to routes/auth.js
 - created a method for checking passwords JWT in models/User.js which we use in controllers/auth.js

- installed package cookie-parser -> will allow as to have acces to "req.cookie" and we can set our token inside a cookie and validate it when it comes back to the server
  - https://www.npmjs.com/package/cookie-parser
  - required in server.js and added to app.use()
  - added a method sendTokenResponse() in controllers/auth.js
  - replaced responses in REGISTER and LOGIN route to new method sendTokenResponse()
    - testing in Postman will show the cookie send with the response

- created a middelware once we get a token we have to send a token to certain routes(CREATE NEW PROFFESION, only login user should be able to do add new proffesion) -> PROTECT
  - created new middelware in middelware/auth.js "auth.js"
  - middelware added to routes/trades.js and added to below rutes:
    - tradePhotoUpload, createTrade, updateTrade, deleteTrade
  - middelware added to routes/proffesions.js and added to below rutes:
    - createProffesion, updateProffesion, deleteProffesion
  - created a new route GET CURRENT LOGGED IN USER in controllers/auth.js
    - route added to routes/auth.js as well the middelware for protected routes
  - we setup storing the token in Postman(REGISTER and LOGIN route) so we don't have to add "Authorization" with "Bearer <token>" in headers when accessing the protected routes 
    - variable setup in "Tests" tab for REGISTER and LOGIN route-> "pm.environment.set("TOKEN", pm.response.json().token)"
      - token variable will be setup as env as soon user logs in or register
    - now in protected routes we can use "Authorization" tab -> type "Bearer Token" -> {{TOKEN}}

created a middelware for authentication in middelware/auth.js -> AUTHORIZE
  - function checks if a logged in user has a specific role so he can make changes to certain routes(POST, UPDATE, DELETE)
  - middelware added to routes/trades.js and added to below rutes:
    - tradePhotoUpload, createTrade, updateTrade, deleteTrade
  - middelware added to routes/proffesions.js and added to below rutes:
    - createProffesion, updateProffesion, deleteProffesion

- how to add comments in .json file
  - https://reqbin.com/req/wtvjp1a3/json-comment-example

- added users.json test data and added model to seeder.js functionality
- modified model/Trade.js and added parameter 'userID' which will be associated with the user in User Model that created a trade
- modified route POST create new trade
  - added functionality:
    - when user is logged in he can create one trade as publisher
    - only admin can create more then one trade
    - associated the user.id from request and added it to req.body so when creating a trade that trade will be associated with that user(userID)

- made modification to UPDATE and DELETE trade in controllers/trades.js as well UPLOAD photo so only the admin or the owner of trade can update or delete the trade

- made modification to CREATE, UPDATE and DELETE proffesions in controllers/proffesions.js so only the admin or the owner of trade/proffesion can create,update or delete the trade

- created a new route in controllers/auth.js FORGOT PASSWORD and added route to routes/auth.js
  - created a new method in User model getResetPasswordToken() to generate and hash password token which is used in FORGOT PASSWORD route
  - modified "UserSchema.pre('save', async function(next)" -> see comments in the function

- setup email sending for route forgot password
  - installed nodemailer -> https://nodemailer.com/about/
  - created account on mailtrap -> https://mailtrap.io/inboxes/1508556/messages
  - configured env in config.env for mailtrap account
  - created new util sendEmail in utils/sendEmail.js and imported it to controllers/auth.js
  - modified our FORGOT PASSWORD route and added functionality to send an email to the user with complete URL and reset token
  - added RESET PASSWORD route in controllers/auth.js and imported it to routes/auth.js
    - once user recieves an email he can use the provided URL in the email to reset/create new password

- created new routes for UPDATE USER DETAILS(name and email) and UPDATE PASSWORD in controllers/auth.js and added routes to routes/auth.js

- created new routes only accesible by admin in controllers/users.js - get users, get user, create user, update user, delete user
  - routes added to routes/users.js, all the routes are rerouting from routes/auth.js to routes/users.js as each route starts with "/api/v1/auth"
  - routes/auth.js also modified as there is rerouting as explained above
  - server.js modified -> route files and mount routers added 
  - all routes added to Postman

- created new model for Reviews
- created test data for reviews
- created routes for reviews in controller/reviews.js
  - get all reviews, get reviews for specific trade, get single review, create new review
  - routes added to routes/reviews.js
  - server.js modified -> route files and mount routers added
  - routes/trades.js modified as well as we are rerouting routes to routes/reviews.js -> when the route is "/api/v1/trades/5d713995b721c3bb38c1f5d0/reviews"
  - Review model modified so the user can post one review per trade
  - new model added to seeder.js

- added additional functionality in model Reviews
  - functionality to calculate avarege rating for trade
  - calculated value will be placed in "averageRating" field in model Trade DB

- created new routes for UPDATE REVIEW and DELETE REVIEW in controllers/reviews.js and added routes to routes/reviews.js
   routes added in Postman as well

API SECURITY
- added additional functionality and commented out the option to set cookie token once user login
  - decided to use only the token created from the header
- added new route LOGOUT USER to controllers/auth.js and added to routes/auth.js, route added to Postman as well

- installed express-mongo-sanitize to prevent hacking the DB
  - for example before adding sanitize functionality we could in the LOGIN USER route send in the body:
    {
    "email": {"$gt":""},
    "password": "123456789"
    }
    - this would find the first user with the entered password, and send a token
  - package added to server.js and added to app.use(), and then we get response:
    {
    "success": false,
    "error": "Resource not found with id of [object Object]"
    }
  - https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
  - https://www.npmjs.com/package/express-mongo-sanitize

  - installed helmet -> Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
    - https://helmetjs.github.io/
    - package added to server.js and added to app.use()
    - to test it make a request to GET TRADES before adding helmet to app.use() and then after adding the helmet to app.use()
      - you will see a difference in numbers of headers in response which are added for security
- installed xss-clean -> middleware to sanitize user input coming from POST body, GET queries, and url params
  - https://github.com/jsonmaur/xss-clean
  - package added to server.js and added to app.use()
  - before installing the package we could place the script tag in the body for example when making request for CREATING NEW TRADE and if we have frontend once the data is fetched from the DB the HTML would include possible harmful script on the website
      {
        "name": "The Hula Hula<script>alert(1)</script>",
            "ownerName": "Dinko Dinkovic",
        "description": "Best pancakes in the world",
        "businessType": "Diner",
            "website": "https://diner.com",
        "phone": "(898) 875 3987",
        "email": "diner@pancakes.com",
        "address": "Ignacego Krasickiego 25 Warszawa",
        "careers": ["Pancake Master", "Server", "Cook"],
        "numberOfEmployees": 19,
            "hiring": true,
        "averagePricePerCouple": 25
      }
  - after implementing the package we get response below with modified/enabled script tag
      {
      "success": true,
      "data": {
          "name": "The Hula Hula&lt;script>alert(1)&lt;/script>",
          "ownerName": "Dinko Dinkovic",
          "description": "Best pancakes in the world",
          "businessType": "Diner",
          "website": "https://diner.com",
          "phone": "(898) 875 3987",
          "email": "diner@pancakes.com"
      }
- installed packages and added them to server.js app.use():
  - express-rate-limit -> Use to limit repeated requests to public APIs and/or endpoints such as password reset
    - https://github.com/nfriedly/express-rate-limit
  - hpp -> middleware to protect against HTTP Parameter Pollution attacks
    - https://github.com/analog-nico/hpp
  - cors -> package for providing a Connect/Express middleware that can be used to enable CORS with various options
    - once we upload our app to domain and then if we create a frontend application on a different domain we will be able to comunnicate with our API
    - https://github.com/expressjs/cors


FRONTEND
- created folders
  - frontend for routes
  - public for static files(css, images)
  - views for ejs rendering HTML pages


- fix the about page - DONE REMOVED
- maybe change photo for on info page for trade, add more info so the footer will be lower - FIXED
- fix CSP policy for font awsome
- add more comments - ok
- add more proffesions
- make functionality for add to chart button -> add cart parameter to Users model - DONE
- add social media icons
- create add to cart page, show list of itemas added to cart, create simple form(name, surname, credit card details), send email with confirmation(bar code for access the course or pdf file with confirmation) - DONE
- check flash messages on wrong login and registration page(change colors - red for errors, green for success)


- finish registration process - DONE
  - registration after email is sent - DONE
    - thank you for registering page, confirmation that the user is in DB(checking by token in URL) - DONE
    - trying to figure out connect-flash - DONE
    - fix confirm registration page, confirm the token in URL before user is able to log in, once logged in delete the token from the DB - DONE

- once user clicks on add to chart button we need to add cost of the class to user DB - FIXED
- send PDF file in email - https://www.geeksforgeeks.org/how-to-create-pdf-document-in-node-js/
  - functionality done
  - NOW we need to make it nice

Summarize of what needs to be done:
- add social icons on the home page or on the individual trade page - DONE
- add comments, add proffesions, add trades
- add more info for individual proffesions(as well start date - dynamically using Date.now(), course duration...)
- backround image for cart page
- style PDF that is sent, add nessesary information in the PDF
- check responsivnes
- add button to change background colors - day/night
- test sending emails on my real test accounts