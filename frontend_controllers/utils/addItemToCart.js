const asyncHandler = require('../../middelware/async');
const User = require('../../models/User');
const Proffesion = require('../../models/Proffesion');

// Add item to cart by using "Add To Cart" button on /trade/:tradeid/proffesions page
exports.addItemToCartBtn = asyncHandler( async(req, res, next) => {
    // Getting the proffesion name from parameters
    const proffesionToAdd = req.params.proffesionTitle;
    const proffesion = await Proffesion.findOne({ title: proffesionToAdd });

    // Adding proffesion to the user model
    await User.findOneAndUpdate({ email: req.session.username}, { "$push": {shoppingCart: proffesionToAdd} }, {
        new: true,
        runValidators: true
    });

    // Getting the user for which cost needs to be added
    const user = await User.findOne({email: req.session.username});

    // Extracting the cost of class from proffesion
    const classCost = proffesion.classCost;

    // Getting totalCost field from User
    const userTotalCost = user.totalCost;

    // Updating total cost of the user
    let newUserTotalCost = userTotalCost + classCost;

    user.totalCost = newUserTotalCost 
    await user.save();

    res.status(204).send();
})