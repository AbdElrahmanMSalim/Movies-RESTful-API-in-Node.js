const joi = require('joi');
const mongoose = require('mongoose');

const Customers = mongoose.model('customers', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true,
        maxlength: 50,
        minlength: 5
    }
}));

function validateCustomer(customer){
    const schema = {
        name: joi.string().max(20).min(5).required(),
        isGold: joi.boolean().required(),
        phone: joi.string().min(5).max(11).required()
    }
    return joi.validate(customer, schema)
}

exports.Customers = Customers;
exports.validateCustomer = validateCustomer;