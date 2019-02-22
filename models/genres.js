const joi = require('joi');
const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genres = mongoose.model('genres', genresSchema);

function validateGenre(genre){
    const schema = {
        name: joi.string().min(5).max(50).required()
    };
    return joi.validate(genre, schema);
}


exports.genresSchema = genresSchema;
exports.Genres = Genres;
exports.validateGenre = validateGenre;
