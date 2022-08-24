const mongoose = require('mongoose');
// package for encrypting the passwords
const bcrypt = require('bcryptjs');
// package for JWT
const jwt = require('jsonwebtoken');
// https://www.w3schools.com/nodejs/ref_crypto.asp - crypto module provides a way of handling encrypted data
// https://www.section.io/engineering-education/data-encryption-and-decryption-in-node-js-using-crypto/#nodejs-crypto-module
const crypto = require('crypto')
// loads environment variables from a .env file into process.env. 
// const dotenv = require('dotenv');

// Load env variables so we can use them
// dotenv.config( { path: '../config/config.env' });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter a name']
    },
    email: {
        type: String,
        required: [true, 'Enter an email'],
        unique: true,
        // custom validation
        // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    userRole: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: 9,
        // exclude field - whenever we perform a find with either method, the password field will not be included in the response
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    registrationToken: {
        type: String
    },
    registrationTokenExpire: {
        type: Date
    },
    shoppingCart: {
        type: Array
    },
    totalCost: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt before saving it to DB
UserSchema.pre('save', async function(next) {

    // we need to check if password was modified so we can save the user(user.save()) in FORGOT PASSWORD ROUTE as this middelware will run pre'save', othrwise we will get an error in response
    /*
    "success": false,
    "error": "Illegal arguments: undefined, string"
    */
    if(!this.isModified('password')) {
        next();
    }
    
    // this part will run only if password was modified because in our UserSchema the password field will not be returned by default
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); 
});

// Sign JWT and return method which will be called on what we initalize on the model, it will be called directly on the user - opposite that statics
// As the method is called directly on the user (in controllers/auth.js in REGISTER route there we will have access to this._id in DB)
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Method to match/check user password on login with password in DB - this function returns a promise so we have to use async/await
// // As the method is called directly on the user (in controllers/auth.js in REGISTER route there we will have to user this.password in DB)
UserSchema.methods.checkUserPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
// https://www.w3schools.com/nodejs/ref_crypto.asp
// https://www.section.io/engineering-education/data-encryption-and-decryption-in-node-js-using-crypto/#nodejs-crypto-module
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hashing the  token and set to resetPasswordToken field
    // generating a value in the "resetPasswordToken" field in our module and storing a hashed version of the token in DB
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire for the token(in this case 10 minutes) - generating a value in the "resetPasswordExpire" field in our module
    this.resetPasswordExpire = Date.now() + 10 *60 * 1000;

    // returning the token value from randomBytes() via API and not the hash version which is stored in DB
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);