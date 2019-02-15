const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
const {Movies, validateMovie} = require('../models/movies')
const {Customers, validateCustomers} = require('../models/customers')
const {Rentals, validateRentals} = require('../models/rentals')

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rentals.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res)=>{
    const rental = await Rentals.findById(req.params.id);
    if(!rental) res.status(404).send("Not Found");
    res.send(rental);
});

router.post('/', auth, async (req, res)=> {
    const {error} = validateRentals(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movies.findById(req.body.movieID);
    if(!movie) return res.status(400).send('Invalid movie.');

    const customer = await Customers.findById(req.body.customerID);
    if(!customer) return res.status(400).send('Invalid customer.');
    
    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rentals({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }, 
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {
                $inc: {numberInStock: -1}
            })
            .run();

        res.send(movie);
    }
    catch(ex){
        res.status(500).send('Internal Server Error');

    }
});

router.put('/:id', auth, async (req, res)=>{
    const {error} = validateRentals(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genres.findById(req.body.genreID);
    if(!genre) return res.status(400).send('Invalid genre.');
    
    const movie = await Rentals.findByIdAndUpdate(req.params.id, 
        { 
        title: req.body.title,
        genre: 
        {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate },
        { new: true})
    
    if(!movie) return res.status(404).send("given id not found");
    
    res.send(movie);     

});

router.delete('/:id', auth, async (req, res)=>{

    const movie = await Rentals.findByIdAndRemove(req.params.id)
    
    if(!movie) return res.status(404).send("given id not found");
    
    res.send(movie);
     

});

module.exports = router;