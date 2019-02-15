
const mongoose = require('mongoose');
const {genresSchema} = require('../models/genres');
const joi = require('joi');

const Movies = mongoose.model('movies', new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 20,
        required: true
    },
    genre: {
        type: genresSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie){
    const schema = {
        title: joi.string().min(5).max(20).required(),
        genreID: joi.objectId().required(),
        numberInStock: joi.number().min(0).max(255).required(),
        dailyRentalRate: joi.number().min(0).max(255).required()
    };
    return joi.validate(movie, schema);
}

exports.Movies = Movies;
exports.validateMovie = validateMovie;