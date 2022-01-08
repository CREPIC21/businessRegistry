const asyncHandler = require('../middelware/async');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sendEmail = require('../utils/sendEmail');

// Cart view page
exports.getCart = asyncHandler( async(req, res, next) => {
    // if user is logged out in and tries to access cart route we will redirect him to the home page
    if(!req.session.loggedin) {
        return res.redirect('/home');
    }

    const errorMessage = req.flash('msg1');

    // getting the list of items in user cart
    // let userObject = await User.findOne({ email: req.session.username}).select('shoppingCart');
    let userObject = await User.findOne({ email: req.session.username});
    // extracting list of items without user _id
    let totalCost = userObject.totalCost;
    let arrShoppingItems = userObject.shoppingCart.sort();
    // console.log(arrShoppingItems);
    let shoppingItems = {};

    // looping through list of items and getting count for each item in the cart(if user placed same items in the cart)
    arrShoppingItems.forEach((item) => {
        shoppingItems[item] = (shoppingItems[item] || 0) + 1;
    });

    res.render('cart', {user: req.session.loggedin, cartItems: shoppingItems, cost: totalCost, errors: errorMessage});
})

exports.postCart = asyncHandler ( async (req, res, next) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.emailaddress;

    const user = await User.findOne({email: req.session.username});

    let emailMessage = `
    
    Dear ${firstName} ${lastName}, this is your confirmation of purchased classes. Please find all the information below:

    Cooking class starts on: 12.12.2022 and finishes on 26.12.2022. 

    Classes are held Monday to Friday from 18:00 - 22:00.

    Total amount paid: $1000.00.

    Your confirmation code: 91849083948
    
    Your bar code:`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('example.pdf'));
    doc.fontSize(18);
    doc.image('bar_codes/logo.jpg', (doc.page.width - 200) /2); // centering the image in PDF
    doc.font('Times-Roman').text(emailMessage, {
        align: 'center'
    });
    doc.image('bar_codes/Capture.JPG', (doc.page.width - 343) /2); // centering the image in PDF
    doc.end();

    await sendEmail({
        email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
        subject: 'Payment Confirmation',
        message: `Confirmation attached as pdf to this message`,
        files: [
            {
                filename: 'example.pdf',
                path: path.join(__dirname, '../example.pdf'),
                contentType: 'application/pdf'
            }
        ]
    });
    messageSent =  true;
    req.flash('msg1', `Payment completed. Check your email for confirmation.`);

    user.totalCost = 0;
    user.shoppingCart = [];
    await user.save();

    return res.redirect('/cart');
});