const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const TradeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add business name.'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more then 50 characters.']
    },
    ownerName: {
        type: String,
        required: [true, 'Please add owner name.'],
        maxlength: [50, 'Name cannot be more then 50 characters.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more then 500 characters.']
    },
    businessType: {
        type: String,
        required: [true, 'Please add a business type, for example: Restaurant, Bar, Bakery, Ice-cream House...'],
        maxlength: [30, 'Business type cannot be more then 30 characters.'],
        enum: ['restaurant', 'bar', 'bakery', 'diner', 'stakehouse', 'ice-cream house', 'club', 'cafe', 'pub', 'lounge', 'hotel', 'motel', 'Restaurant', 'Bar', 'Bakery', 'Diner', 'Stakehouse', 'Ice-Cream House', 'Club', 'Cafe', 'Pub', 'Lounge', 'Hotel', 'Motel']
    },
    website: {
        type: String,
        // custom validation
        // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
        match: [
            /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be more then 20 characters.']
    },
    email: {
        type: String,
        // custom validation
        // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    // https://mongoosejs.com/docs/geojson.html - GeoJSON Point
    location: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true
          },
          coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String
    }, 
    careers: {
        // Array of strings
        type: [String],
        required: true,
        // enum means that these are the only avaliable values
        enum: [
            'Server',
            'Cook',
            'Barista',
            'Host',
            'Coffee Expert',
            'Coctail Master',
            'Pizza Man',
            'Delivery Driver',
            'Burek Master',
            'Pancake Master',
            'Pastry Chef',
            'Ice-cream Master',
            'Stake Master',
            'Dancer',
            'Other',
            'server',
            'cook',
            'barista',
            'host',
            'coffee expert',
            'coctail master',
            'pizza man',
            'delivery driver',
            'burek master',
            'pancake master',
            'pastry chef',
            'ice-cream master',
            'stake master',
            'dancer',
            'other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averagePricePerCouple: {
        type: Number
    },
    avaregeProffesionsPrice: {
        type: Number
    },
    photo: {
        type: String,
        // if there is no photo we want to display default photo
        default: 'no-photo.jpg'
    },
    numberOfEmployees: {
        type: Number
    },
    hiring: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // ID that is associated with the object ID of the user
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    // below parameters have to go right here for reverse virtual populate to work
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// create trade slug field from the name parameter
TradeSchema.pre('save', function(next) {
    // Using "this" in a slug we can access all the fields in the database object(name, address, phone...)
    console.log('Slugify was ran', this.phone);

    // we are refering to "slug" field in our DB schema
    this.slug = slugify(this.name, { lower: true});

    next();
});

// geocode and create bootcamp location field
// as the geocode method is asyncronious we will use async/await instead ".then"
TradeSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);

    // we are refering to "location" field in our DB schema
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // do not save address in DB as we are getting the address from formattedAddress above
    this.address = undefined;

    next();
});

// Middelware - Cascade delete all proffesions associated with deleted trade (DELETE request in controllers/trades.js)
TradeSchema.pre('remove', async function(next) {
    console.log(`Proffesions being removed from trade ${this._id}`);
    await this.model('Proffesion').deleteMany({ trade: this._id});
    next();
});

// Reverse populate with virtuals -> when we make GET request for all trades to include proffesions associated with that trade
TradeSchema.virtual('proffesions', {
    ref: 'Proffesion',
    localField: '_id',
    foreignField: 'trade',
    justOne: false
});

module.exports = mongoose.model('Trade', TradeSchema);