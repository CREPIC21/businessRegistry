const asyncHandler = require('../../middelware/async');
const User = require('../../models/User');

// Login form and registration(after clicking on the link in email) validation 
// - checking if the user is in the DB and storing request.session.loggedin to true so we can use this to check during the session of the user is logged in or not to make different views accessible
exports.auth = asyncHandler( async(request, response, next) => {
    const email = request.body.email;
	const password = request.body.password;
    const userToken = request.params.registrationid;

    const user = await User.findOne({ email: email}).select('+password');

    // registration(after clicking on the link in email) validation - checking if token is in the URL and if the user is in DB
    if(userToken && user) {
        // checking if the user has registration token in DB
        if(user.registrationToken) {
            // checking if the token from URL matches with the user token in DB
            if(userToken === user.registrationToken) {
                const tokenExpiry = user.registrationTokenExpire;
                const currentTime = new Date();
    
                // checking if the token from the email is expired
                if(tokenExpiry.getTime() > currentTime.getTime()) {
                    const passMatch = await user.checkUserPassword(password);
                    if(!passMatch) {
                        request.flash('msg1', `Invalid password.`);
                        return response.redirect(`/confirmregistration/${userToken}`);
                    } else {
                        request.session.loggedin = true;
                        request.session.username = email;
                        // once user is validated we are deleting the token field and expiry token field from DB
                        await user.update({$unset: {registrationToken: 1, registrationTokenExpire: 1}});
                        return response.redirect('/home');
                    }
                // expired token
                } else {
                    request.flash('msg1', `Your registration token has expired. Please register again to recieve a new token.`);
                    await User.deleteOne({ email: email });
                    return response.redirect('/register');
                }
            // if user will use registration link but enter the wrong email or he is using confirmation link with expired token
            } else {
                request.flash('msg1', `Invalid token for email ${user.email}. Please enter email used in registration form or use most recent registration link.`);
                return response.redirect(`/confirmregistration/${userToken}`);
            }
        // no token for user in DB
        } else {
            request.flash('msg1', `Registration token does not exist under email ${user.email}. Please enter email used in registration form.`);
            return response.redirect(`/confirmregistration/${userToken}`);
        }
    // no user in DB
    } else if(userToken && !user) {
        request.flash('msg1', `Invalid username.`);
        return response.redirect(`/confirmregistration/${userToken}`);
    }

    // Check/validate email and password on login
    if(!user) {
        request.flash('msg1', `User with the email ${request.body.email} does not exist.`);
        return response.redirect('/login');
    } else {
        // if user that did not finish registration process tries to log in
        if(user.registrationToken) {
            request.flash('msg1', `Finish registration process before logging in. Check you email for registration link that was sent to you.`);
            return response.redirect('/login');
        }
        // Validation/check for password match -> comparing password entered by the user on login with password in DB
        const passMatch = await user.checkUserPassword(password);
        if(!passMatch) {
            request.flash('msg1', `Invalid password.`);
            return response.redirect('/login');
        } else {
            // once user will pass the validation, we will store user email in the session
            request.session.loggedin = true;
            request.session.username = email;
            return response.redirect('/home');
        }
    }

    
})