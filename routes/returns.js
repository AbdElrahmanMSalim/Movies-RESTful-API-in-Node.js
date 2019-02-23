const auth = require('../middleware/auth');
const router = require('express').Router();
const { Rentals } = require('../models/rentals');
const { Movies } = require('../models/movies');
const joi = require('joi');

router.post('/', auth, async (req, res) => {
    const { error } = validateReturn(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);
    
    if(!rental) return res.status(404).send('no rental found for the given cutomer\movie combintaion');

    if(rental.dateReturned) return res.status(400).send('rental is already processed');
    
    rental.return();
    await rental.save();

    await Movies.update({_id: req.body.movieId }, { 
        $inc: { numberInStock: 1 } 
    });

    return res.status(200).send(rental);
});


function validateReturn(req){
    const schema = {
        customerId: joi.objectId().required(),
        movieId: joi.objectId().required(),
    };
    return joi.validate(req, schema);
}
module.exports = router;