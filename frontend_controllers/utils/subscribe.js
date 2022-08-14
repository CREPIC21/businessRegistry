const asyncHandler = require('../../middelware/async');
const fetch = require("node-fetch");
// import fetch from 'node-fetch';

// Add item to cart by using "Add To Cart" button on /trade/:tradeid/proffesions page
exports.subscribe = asyncHandler( async(req, res, next) => {
    let subscriptionEmail = req.params.email;

    let url = process.env.SHEETY_API_POST;
    let body = {
        "email": {
            "newEmail": subscriptionEmail
        }
    }
    try {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response) => response.json())
          .then(json => {
            console.log("sending")
            console.log(json.email);
          });
        
    } catch (error) {
        console.log(error)
    }
    res.status(204).send();
})