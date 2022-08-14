const { string } = require('i/lib/util');
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    email: {
        type: string
    }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema);