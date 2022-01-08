const express = require('express');
// file system module, included with node - https://www.w3schools.com/nodejs/nodejs_filesystem.asp
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Trade = require('../models/Trade');
const Proffesion = require('../models/Proffesion');
const Review = require('../models/Review');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// // Display home page(landing page) - user not logged in
// router.get('/', async function(req, res) {
//     res.render('landingPage', {user: req.session.loggedin});
// });

// Login form and registration(after clicking on the link in email) validation - checking if the user is in the DB and storing request.session.loggedin to true so we can use this to check during the session of the user is logged in or not to make different views accessible
// router.post('/auth/:registrationid?', async function(request, response) {
// 	const email = request.body.email;
// 	const password = request.body.password;
//     const userToken = request.params.registrationid;

//     const user = await User.findOne({ email: email}).select('+password');

//     // registration(after clicking on the link in email) validation
//     if(userToken && user) {
//         if(user.registrationToken) {
//             if(userToken === user.registrationToken) {
//                 const tokenExpiry = user.registrationTokenExpire;
//                 const currentTime = new Date();
    
//                 // checking if the token from the email is expired
//                 if(tokenExpiry.getTime() > currentTime.getTime()) {
//                     const passMatch = await user.checkUserPassword(password);
//                     if(!passMatch) {
//                         request.flash('msg1', `Invalid password.`);
//                         return response.redirect(`/confirmregistration/${userToken}`);
//                     } else {
//                         request.session.loggedin = true;
//                         request.session.username = email;
//                         // once user is validated we are deleting the token field and expiry token field from DB
//                         await user.update({$unset: {registrationToken: 1, registrationTokenExpire: 1}});
//                         return response.redirect('/home');
//                     }
//                 } else {
//                     request.flash('msg1', `Your registration token has expired. Please register again to recieve a new token.`);
//                     await User.deleteOne({ email: email });
//                     return response.redirect('/register');
//                 }
//             } else {
//                 request.flash('msg1', `Invalid token for email ${user.email}. Please enter email used in registration form or use most recent registration link.`);
//                 return response.redirect(`/confirmregistration/${userToken}`);
//             }
//         } else {
//             request.flash('msg1', `Registration token does not exist under email ${user.email}. Please enter email used in registration form.`);
//             return response.redirect(`/confirmregistration/${userToken}`);
//         }
//     } else if(userToken && !user) {
//         request.flash('msg1', `Invalid username.`);
//         return response.redirect(`/confirmregistration/${userToken}`);
//     }

//     // Check/validate email and password on login
//     if(!user) {
//         request.flash('msg1', `User with the email ${request.body.email} does not exist.`);
//         return response.redirect('/login');
//     }

//     // Validation/check for password match -> comparing password entered by the user on login with password in DB
//     const passMatch = await user.checkUserPassword(password);
//     if(!passMatch) {
//         request.flash('msg1', `Invalid password.`);
//         return response.redirect('/login');
//     } else {
//         // once user will pass the validation, we will store user email in the session
//         request.session.loggedin = true;
// 		request.session.username = email;
// 		return response.redirect('/home');
//     }
// });

// // Home page which will display all trades if the user is logged in
// router.get('/home', async function(req, res) {
//     Trade.find({}, function(err, result) {
//                 if(!err) {
//                     res.render('home', {allTrades: result, user: req.session.loggedin});
//                     console.log(req.session.username);
//                 }
//             });
// });

// // logout functionality
// router.get('/logout', function(req, res) {
//     req.session.loggedin = false;
// 	req.session.username = undefined;
//     res.redirect("/login");
// })

// // Display info for single trade
// router.get('/trade/:id', async function(req, res) {

//     if(req.session.loggedin) {
//     const tradeResult = await Trade.findOne({_id: req.params.id});
//     const reviewResults = await Review.find({trade: req.params.id});
//     let reviews = [];

//     let sessionUser = await User.findOne({ email: req.session.username}, 'name');
//     let userAlreadyCommented = false;

//         // getting names of author reviws
//         for(let i =0; i < reviewResults.length; i++) {
//             const userResult = await User.findOne({_id: reviewResults[i].userID}, 'name');
//             console.log(userResult)

//             // checking if the current user already posted the comment, if he did the form to post comment will not be visible for that user
//             if(userResult.name === sessionUser.name) {
//                 userAlreadyCommented = true;
//             }

//             let review = {
//             title: reviewResults[i].title,
//             text: reviewResults[i].text,
//             author: userResult.name
//             }
//             reviews.push(review);           
//         }
//         res.render('trade', {tradeToRender: tradeResult, reviewToRender: reviews, user: req.session.loggedin, alreadyCommented: userAlreadyCommented});
//     } else {
//         res.redirect('/home');
//     }
// });

// // Display proffesions for single trade
// router.get('/trade/:id/proffesions', function(req, res) {

//     if(req.session.loggedin) {
//     Proffesion.find({trade: req.params.id}, function(err, result) {
//        if(!err) {
//            res.render('proffesions', {proffesionsToRender: result, user: req.session.loggedin});
//        }
//    })
//     } else {
//         res.redirect('/home');
//     }
// });

// // Login Page
// router.get('/login', function(req, res) {
//     const errorMessage = req.flash('msg1');
//     // if user is logged in and tries to access login route we will redirect him to the home page
//     if(req.session.loggedin) {
//         return res.redirect('/home');
//     }
//     res.render('login', {user: req.session.loggedin, errors: errorMessage});
// });


// // Register Page
// router.get('/register', function(req, res) {
//     // Creating an 'errorMessage' object which we can use and pass on to create flash messages for validation
//     const errorMessage = req.flash('msg1');
//     // if user is logged in and tries to access register route we will redirect him to the home page
//     if(req.session.loggedin) {
//         return res.redirect('/home');
//     }
//     res.render('register', {user: req.session.loggedin, errors: errorMessage});
// });

// router.post('/register', async function(req, res) {
//     // using destructuring to extract nessesary data from the request body - for registering the user we need name, email, password and user role
//     // const { name, email, password, userRole } = req.body;
//     const name = req.body.fullname;
//     const email = req.body.email;
//     const password = req.body.pwd;

//     const user = await User.findOne({ email: email});

//     if(!user) {

//         try {
//             const newUser = await User.create({
//                 name,
//                 email,
//                 password
//             });

//             const token = newUser.getSignedJwtToken();

//             newUser.registrationToken = token;
//             newUser.registrationTokenExpire = new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
//             await newUser.save();

//             await sendEmail({
//                 email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
//                 subject: 'Business Registry - Registration Confirmation',
//                 message: `Confirm your registration by clicking on the following link http://localhost:5000/confirmregistration/${token}`
//             });
//             messageSent =  true;
//             req.flash('msg1', `Thank you for registering. Your confirmation email is on the way. Check your mail.`);
//             return res.redirect('/register');
            
//         } catch (error) {
//             // if something goes wrong while sending the email we want to set
//             messageSent =  false;
//             req.flash('msg1', `Email was not send. Please register again`);
//             return res.redirect('/register');
//         }
//     } else {
//         req.flash('msg1', `User with the email ${req.body.email} already exists. Choose another email`);
//         res.redirect('/register');
//     } 
// });

// router.get('/confirmregistration/:registrationid', function(req, res) {
//     const errorMessage = req.flash('msg1');
//     console.log(req.params.registrationid);
//     res.render('confirmRegistration', {userToken: req.params.registrationid, errors: errorMessage});
// });

// // Contact form routes
// router.get('/contact', function(req,res) {
//     const errorMessage = req.flash('msg1');
//     res.render('contact', {user: req.session.loggedin, errors: errorMessage});
// });

// router.post('/contact', async function(req, res) {

//     try {
//         await sendEmail({
//             email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
//             subject: 'Contact Form Message',
//             message: req.body.message
//         });
//         messageSent =  true;
//         req.flash('msg1', `Email sent.`);
//         res.redirect('/contact');
        
//     } catch (error) {
//         // if something goes wrong while sending the email we want to set
//         messageSent =  false;
//         req.flash('msg1', `Email was not send. Please try again`);
//         res.redirect('/contact');
        
//     }
// });

// // Adding a comment to trade - form will be visible on the page only if the current user did not leave a comment for current trade
// router.post('/comment', async function(req, res) {

//     const user = await User.findOne({ email: req.session.username});

//     // extracting trade ID from the URL
//     let headerTradeID = req.headers.referer;
//     let tradeID = headerTradeID.split("/");
//     tradeID = tradeID[tradeID.length - 1];

//     req.body.trade = tradeID;
//     req.body.userID = user._id;

//     await Review.create(req.body);

//     // res.render('home', {user: req.session.loggedin});
//     return res.redirect('/home');
// });

// // Add proffesion to cart
// router.get('/addToCart/:proffesionTitle', async function(req, res) {

//     // Getting the proffesion name from parameters
//     const proffesionToAdd = req.params.proffesionTitle;
//     const proffesion = await Proffesion.findOne({ title: proffesionToAdd });

//     // Adding proffesion to the user model
//     await User.findOneAndUpdate({ email: req.session.username}, { "$push": {shoppingCart: proffesionToAdd} }, {
//         new: true,
//         runValidators: true
//     });

//     // Getting the user for which cost needs to be added
//     const user = await User.findOne({email: req.session.username});

//     // Extracting the cost of class from proffesion
//     const classCost = proffesion.classCost;

//     // Getting totalCost field from User
//     const userTotalCost = user.totalCost;

//     // Updating total cost of the user
//     let newUserTotalCost = userTotalCost + classCost;

//     user.totalCost = newUserTotalCost 
//     await user.save();

//     res.status(204).send();
// });

// router.get('/cart', async function(req, res) {
//     // if user is logged out in and tries to access cart route we will redirect him to the home page
//     if(!req.session.loggedin) {
//         return res.redirect('/home');
//     }

//     const errorMessage = req.flash('msg1');

//     // getting the list of items in user cart
//     // let userObject = await User.findOne({ email: req.session.username}).select('shoppingCart');
//     let userObject = await User.findOne({ email: req.session.username});
//     // extracting list of items without user _id
//     let totalCost = userObject.totalCost;
//     let arrShoppingItems = userObject.shoppingCart.sort();
//     // console.log(arrShoppingItems);
//     let shoppingItems = {};

//     // looping through list of items and getting count for each item in the cart(if user placed same items in the cart)
//     arrShoppingItems.forEach((item) => {
//         shoppingItems[item] = (shoppingItems[item] || 0) + 1;
//     });

//     res.render('cart', {user: req.session.loggedin, cartItems: shoppingItems, cost: totalCost, errors: errorMessage});
// });

// router.post('/cart', async function(req, res) {

//     const firstName = req.body.firstname;
//     const lastName = req.body.lastname;
//     const email = req.body.emailaddress;

//     const user = await User.findOne({email: req.session.username});

//     let emailMessage = `
    
//     Dear ${firstName} ${lastName}, this is your confirmation of purchased classes. Please find all the information below:

//     Cooking class starts on: 12.12.2022 and finishes on 26.12.2022. 

//     Classes are held Monday to Friday from 18:00 - 22:00.

//     Total amount paid: $1000.00.

//     Your confirmation code: 91849083948
    
//     Your bar code:`;

//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream('example.pdf'));
//     doc.fontSize(18);
//     doc.image('bar_codes/logo.jpg', (doc.page.width - 200) /2); // centering the image in PDF
//     doc.font('Times-Roman').text(emailMessage, {
//         align: 'center'
//     });
//     doc.image('bar_codes/Capture.JPG', (doc.page.width - 343) /2); // centering the image in PDF
//     doc.end();

//     await sendEmail({
//         email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
//         subject: 'Payment Confirmation',
//         message: `Confirmation attached as pdf to this message`,
//         files: [
//             {
//                 filename: 'example.pdf',
//                 path: path.join(__dirname, '../example.pdf'),
//                 contentType: 'application/pdf'
//             }
//         ]
//     });
//     messageSent =  true;
//     req.flash('msg1', `Payment completed. Check your email for confirmation.`);

//     user.totalCost = 0;
//     user.shoppingCart = [];
//     await user.save();

//     return res.redirect('/cart');
// })

// // Function to remove item from the cart when user clicks on "-" icon
// router.get('/removeitem/:itemname', async function(req, res) {

//         // Getting the item to remove by name
//         const itemToRemove = req.params.itemname;
//         // Getting the user for which item needs to be removed
//         const user = await User.findOne({email: req.session.username});

//         // Getting the cost of class
//         const classObject = await Proffesion.findOne({ title: req.params.itemname}).select('classCost');
//         if(!classObject) {
//             return res.status(204).send();
//         }
//         // Extracting the cost of class from object
//         const classCost = classObject.classCost;
//         // Getting totalCost field from User
//         const userTotalCost = user.totalCost;
//         let newUserTotalCost = userTotalCost - classCost;
//         user.totalCost = newUserTotalCost;
//         await user.save();

//         // Getting the index of item to be removed from DB
//         const itemIndex = user.shoppingCart.indexOf(itemToRemove);
//         // Using splice method to modify the shoppingCart array by removing the selected item
//         user.shoppingCart.splice(itemIndex, 1);

//         const itemsInCart = user.shoppingCart;
//         // console.log(itemsInCart);
//         // console.log(user.totalCost);
//         await user.save();
        
//         // using redirect here will change the order of items on the screen - fixed by sorting the array in /cart route
//         res.redirect('/cart');
//         // res.status(204).send();     
// });

// // Function to add item from to cart when user clicks on "+" icon
// router.get('/additem/:itemname', async function(req, res) {

//     // Getting the item to add by name
//     const itemToAdd = req.params.itemname;
//     // Getting the user for which item needs to be added
//     const user = await User.findOne({email: req.session.username});

//     // Getting the cost of class
//     const classObject = await Proffesion.findOne({ title: req.params.itemname}).select('classCost');
//     if(!classObject) {
//         return res.status(204).send();
//     }
//     // Extracting the cost of class from object
//     const classCost = classObject.classCost;
//     // Getting totalCost field from User
//     const userTotalCost = user.totalCost;
//     let newUserTotalCost = userTotalCost + classCost;
//     user.totalCost = newUserTotalCost 
//     await user.save();

//     // Using splice method to modify the shoppingCart array by removing the selected item
//     user.shoppingCart.push(itemToAdd);
//     const itemsInCart = user.shoppingCart;
//     // console.log(itemsInCart);
//     // console.log(user.totalCost);
//     await user.save();
    
//     // using redirect here will change the order of items on the screen - fixed by sorting the array in /cart route
//     res.redirect('/cart');
//     // res.status(204).send();         
// });

module.exports = router;