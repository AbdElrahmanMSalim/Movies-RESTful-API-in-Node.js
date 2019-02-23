const mongoose = require('mongoose');
const joi = require('joi');
const moment = require('moment');


const rentalsSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                maxlength: 50,
                minlength: 5
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: Number,
                required: true,
                maxlength: 50,
                minlength: 5
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                trim: true,
                minlength: 5,
                maxlength: 20,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
    required: true
    },
    dateOut: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    dateReturned: { 
        type: Date
    },
    rentalFee: { 
        type: Number, 
        min: 0
    }
});

rentalsSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({ 
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentalsSchema.methods.return = function () {
    this.dateReturned = new Date();
    this.rentalFee = this.movie.dailyRentalRate * moment().diff(this.dateOut, 'days');
}
const Rentals = new mongoose.model('rentals', rentalsSchema);


function validateRentals(rental){
    const schema = {
        customerId: joi.objectId().required(),
        movieId: joi.objectId().required(),
    };
    return joi.validate(rental, schema);
}

exports.Rentals = Rentals;
exports.validateRentals = validateRentals;

