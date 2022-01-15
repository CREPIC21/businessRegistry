// file system module, included with node - https://www.w3schools.com/nodejs/nodejs_filesystem.asp
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
//loads environment variables from a .env file into process.env
const dotenv = require('dotenv');

// Load env variables so we can use them
dotenv.config( { path: './config/config.env' });

// Load models
const Trade = require('./models/Trade');
const LearnProffesion = require('./models/Proffesion');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const trades = JSON.parse(fs.readFileSync(`${__dirname}/testing_data/trades.json`, 'utf-8'));
const learnProffesions = JSON.parse(fs.readFileSync(`${__dirname}/testing_data/proffesions.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/testing_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/testing_data/reviews.json`, 'utf-8'));

// Functionality to IMPORT data into DB
const importData = async() => {

    try {

        await User.create(users);
        await Trade.create(trades);
        await LearnProffesion.create(learnProffesions);
        await Review.create(reviews);
        
        console.log('Data imported to database'.green.italic);

        /*
        The exit in node.js is done in two ways:
        1. Calling process.exit() explicitly.
        2. Or, if node.js event loop is done with all tasks, and there is nothing left to do. Then, the node application will automatically exit.
        In our case, we needed to explicitly or forcefully exit nodejs before other events being finished. So we used the same.
        */
        process.exit();

    } catch (error) {
        console.log(error);
    }
}

// Functionality to DELETE data from DB
const deleteData = async() => {

    try {
        
        // deleteMany() will delete all the data
        await Trade.deleteMany();
        await LearnProffesion.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data deleted/destroyed.'.red.italic);

        /*
        The exit in node js is done in two ways:
        1. Calling process. exit() explicitly.
        2. Or, if nodejs event loop is done with all tasks, and there is nothing left to do. Then, the node application will automatically exit.
        In our case, we needed to explicitly or forcefully exit nodejs before other events being finished. So we used the same.
        */
        process.exit();

    } catch (error) {
        console.log(error);
    }
}

// when we call this functions with node seeder we want to add an argument which will specfy if we want to import or delete data
if(process.argv[2] === '-im') {
    importData();
} else if(process.argv[2] === '-dl') {
    deleteData();
}
