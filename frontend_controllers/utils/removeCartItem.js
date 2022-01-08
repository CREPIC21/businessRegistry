const asyncHandler = require('../../middelware/async');
const User = require('../../models/User');
const Proffesion = require('../../models/Proffesion');

// Remove cart item from basket by using "-" on /cart page
exports.removeCartItem = asyncHandler( async(req, res, next) => {
    // Getting the item to remove by name
    const itemToRemove = req.params.itemname;
    // Getting the user for which item needs to be removed
    const user = await User.findOne({email: req.session.username});

    // Getting the cost of class
    const classObject = await Proffesion.findOne({ title: req.params.itemname}).select('classCost');
    if(!classObject) {
        return res.status(204).send();
    }
    // Extracting the cost of class from object
    const classCost = classObject.classCost;
    // Getting totalCost field from User
    const userTotalCost = user.totalCost;
    let newUserTotalCost = userTotalCost - classCost;
    user.totalCost = newUserTotalCost;
    await user.save();

    // Getting the index of item to be removed from DB
    const itemIndex = user.shoppingCart.indexOf(itemToRemove);
    // Using splice method to modify the shoppingCart array by removing the selected item
    user.shoppingCart.splice(itemIndex, 1);

    const itemsInCart = user.shoppingCart;
    // console.log(itemsInCart);
    // console.log(user.totalCost);
    await user.save();
    
    // using redirect here will change the order of items on the screen - fixed by sorting the array in /cart route
    res.redirect('/cart');
    // res.status(204).send();    
})