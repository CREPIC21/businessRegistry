const asyncHandler = require('../middelware/async');
const sendEmail = require('../utils/sendEmail');

// Contact page
exports.getContact = asyncHandler( async (req, res, next) => {
    const errorMessage = req.flash('msg1');
    res.render('contact', {user: req.session.loggedin, errors: errorMessage});
});

exports.postContact = asyncHandler( async (req, res, next) => {
    try {
        await sendEmail({
            email: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,

            // email_sender: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,
            // email_reciever: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}`,

            subject: 'Contact Form Message',
            message: req.body.message
        });
        messageSent =  true;
        req.flash('msg1', `Email sent.`);
        res.redirect('/contact');
        
    } catch (error) {
        // if something goes wrong while sending the email we want to set
        messageSent =  false;
        req.flash('msg1', `Email was not send. Please try again`);
        res.redirect('/contact');
    }
});