const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a review title'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add review']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // ID that is associated with the object ID of the trade
    trade: {
        type: mongoose.Schema.ObjectId,
        ref: 'Trade',
        required: true
    },
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Making sure that the same user can add only one review per trade
ReviewSchema.index({ trade: 1, userID: 1}, { unique: true });

// Static method to get avgarege rating and save it to DB - copy/paste from models/Proffesion.js and modified
// Statics are methods that are called directly on the model as below statics
ReviewSchema.statics.getAvaregeRating = async function(tradeId) {
    // console.log('Calculating avarege cost..'.blue);

    const obj = await this.aggregate([
        {
            $match: { trade: tradeId }
        },
        {
            // averageRating field in model Trade will be populated with calculated value
            $group: {
                _id: '$trade',
                averageRating: { $avg: '$rating'}
            }
        }
    ]);

    // console.log(obj);
    try {
        await this.model('Trade').findByIdAndUpdate(tradeId, {
            averageRating: Math.round(obj[0].averageRating)
        })
    } catch (error) {
        console.error(error);
    }
};

// Call getAveregeCost for all proffesions(total cost of all proffesions for trade/number of proffesions) after save - if we save course we want to recalculate avaregeCost
// we need to use async/await here otherwise the rating will not be added to trades when running the seeder functionality
ReviewSchema.post('save', async function() {
    await this.constructor.getAvaregeRating(this.trade);
});

// Call getAveregeCost all proffesions(total cost of all proffesions for trade/number of proffesions) before remove - if we remove course we want to recalculate avaregeCost
ReviewSchema.pre('remove', function() {
    this.constructor.getAvaregeRating(this.trade);
});

module.exports = mongoose.model('Review', ReviewSchema);