const mongoose = require('mongoose');
const joi = require('joi');


const Rentals = new mongoose.model('rentals', mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: Boolean,
                required: true,
                maxlength: 50,
                minlength: 5
            },
            isGold: {
                type: Boolean,
                required: true
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
}));


function validateRentals(rental){
    const schema = {
        customerID: joi.objectId().required(),
        movieID: joi.objectId().required(),
    };
    return joi.validate(rental, schema);
}

exports.Rentals = Rentals;
exports.validateRentals = validateRentals;

