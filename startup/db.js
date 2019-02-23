const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    console.log(db);
    mongoose.connect(db)
        .then(()=> winston.info(`Connected to ${db}`));
}