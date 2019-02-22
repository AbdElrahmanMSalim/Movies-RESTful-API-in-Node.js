const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
}

const Users = mongoose.model('users', userSchema);

function validateUser(user){
    const schema = {
        name: joi.string().min(5).max(50).required(),
        email: joi.string().required().email().min(5).max(255),
        password: joi.string().min(5).max(255).required()
    }
    return joi.validate(user, schema);
}


exports.Users = Users;
exports.validateUser = validateUser;