const mongoose = require('mongoose');

const ProffesionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim:true,
        required: [true, 'Please add a class title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    classCost: {
        type: Number,
        required: [true, 'Please add a class cost']
    },
    minimumSkillLevel: {
        type: String,
        required: [true, 'Please add a minimum skill level'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    certificateAvaliable: {
        type: Boolean,
        default: false
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

// Static method to get avgarege cost for all proffesions
// Statics are methods that are called directly on the model as below statics
ProffesionSchema.statics.getAvaregeCost = async function(tradeId) {
    // console.log('Calculating avarege cost..'.blue);

    const obj = await this.aggregate([
        {
            $match: { trade: tradeId }
        },
        {
            // avaregeProffesionsPrice field in model Trade will be populated with calculated value
            $group: {
                _id: '$trade',
                avaregeProffesionsPrice: { $avg: '$classCost'}
            }
        }
    ]);

    // console.log(obj);
    try {
        await this.model('Trade').findByIdAndUpdate(tradeId, {
            avaregeProffesionsPrice: Math.ceil(obj[0].avaregeProffesionsPrice / 10) * 10
        })
    } catch (error) {
        console.error(error);
    }
};

// Call getAveregeCost for all proffesions(total cost of all proffesions for trade/number of proffesions) after save - if we save course we want to recalculate avaregeCost
ProffesionSchema.post('save', function() {
    this.constructor.getAvaregeCost(this.trade);
});

// Call getAveregeCost all proffesions(total cost of all proffesions for trade/number of proffesions) before remove - if we remove course we want to recalculate avaregeCost
ProffesionSchema.pre('remove', function() {
    this.constructor.getAvaregeCost(this.trade);
});

module.exports = mongoose.model('Proffesion', ProffesionSchema);