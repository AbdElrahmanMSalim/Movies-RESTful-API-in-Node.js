const joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {Users} = require('../models/users');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await Users.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invaild E-mail");
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid Password");

    const token = user.generateAuthToken();
    res.send(token);
});

function validateUser(user){
    const schema = {
        email: joi.string().required().email().min(5).max(255),
        password: joi.string().min(5).max(255).required()
    }
    return joi.validate(user, schema)
}

module.exports = router;
