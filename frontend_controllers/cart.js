const asyncHandler = require('../middelware/async');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sendEmail = require('../utils/sendEmail');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAY_PAL_CLIENT_ID,
    'client_secret': process.env.PAY_PAL_CLIENT_SECRET
  });

// Cart view page
exports.getCart = asyncHandler( async(req, res, next) => {
    // if user is logged out in and tries to access cart route we will redirect him to the home page
    if(!req.session.loggedin) {
        return res.redirect('/home');
    }

    const errorMessage = req.flash('msg1');
    // if the cart is empty when user clicks on payment we will display message
    let cartEmpty = false;

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

    res.render('cart', {user: req.session.loggedin, cartItems: shoppingItems, cost: totalCost, errors: errorMessage, cartEmpty:cartEmpty});
})

// function that will take an object of purchased items and create a message to be injected in the email
function createMessage(obj) {
    let message = "";
    for (let item in obj) {
        message += `${item} - items purchased: ${obj[item]}\n`
    }
    // console.log(message);
    return message;
}

exports.pay = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email: req.session.username});
    const purchasedCartItems = user.shoppingCart.sort();
    const totalCostAmount = user.totalCost;
    console.log(purchasedCartItems);
    if(purchasedCartItems.length === 0) {
        // req.flash('msg1', `Cart is empty.`);
        return res.redirect('/cart');
    }
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://businessregistry.xyz/cart/success",
            "cancel_url": "https://businessregistry.xyz/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Item",
                    "sku": "001",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "5.00"
            },
            "description": "Hat hat hat."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            // console.log("Create Payment Response");
            // console.log(payment);
            // res.send();

            for(let i = 0; i < payment.links.length; i++) {
                if(payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href)
                }
            }
        }
    });
})

exports.paymentSuccess = asyncHandler(async (req, res, next ) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            // console.log(JSON.stringify(payment));
            // res.send('Success');
            const user = await User.findOne({email: req.session.username});
            // getting items from shopping cart
            const purchasedCartItems = user.shoppingCart.sort();
            // getting total amount cost
            const totalCostAmount = user.totalCost;
            // creating an organized object from purchased items
            let shoppingItems = {};
            purchasedCartItems.forEach((item) => {
                shoppingItems[item] = (shoppingItems[item] || 0) + 1;
            });

            // console.log(shoppingItems);

            // creating a message that include purchased classes with their quantity
            let classesMessage = createMessage(shoppingItems);
            // console.log(classesMessage);

            let emailMessage = `
            
            Dear Miki Maus, this is your confirmation of purchased classes. Please find all the information below:

            ${classesMessage} 
            Classes are held Monday to Friday from 18:00 - 22:00.

            Total amount paid: $ ${totalCostAmount}.

            Your confirmation code: 91849083948
            
            Your QR code:`;

            // creating PDF document confirmation that will be sent in the email
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream('example.pdf'));
            doc.fontSize(18);
            doc.image('bar_codes/logo.jpg', (doc.page.width - 200) /2); // centering the image in PDF
            doc.font('Times-Roman').text(emailMessage, {
                align: 'center'
            });
            doc.image('bar_codes/qr.JPG', (doc.page.width - 214) /2); // centering the image in PDF
            doc.end();

            await sendEmail({
                email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,

                // email_sender: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
                // email_reciever: req.body.email,

                subject: 'Payment Confirmation',
                message: `Please find the payment confirmation and all information about your purchased classes attached as a PDF document to this message.\n\nKind Regards,\nBusiness Registry`,
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

            // once purchase is success and email is sent we are reseting cost and shopping cart for the user
            user.totalCost = 0;
            user.shoppingCart = [];
            await user.save();

            return res.redirect('/cart');
                }
            });
})

exports.paymentCanceled = asyncHandler (async (req, res, next) => {
    // res.send('Cancelled')
    return res.redirect('/cart');
});