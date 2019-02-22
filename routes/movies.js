const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movies, validateMovies} = require('../models/movies')
const {Genres} = require('../models/genres')


router.get('/', async (req, res) => {
    const movies = await Movies.find().sort('name');

    res.send(movies);
});

router.get('/:id', async (req, res)=>{
    const movie = await Movies.findById(req.params.id);

    if(!movie) res.status(404).send("Not Found");

    res.send(movie);
});

router.post('/', auth, async (req, res)=> {
    const {error} = validateMovies(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreID);
    if(!genre) return res.status(400).send('Invalid genre.');
    
    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();

    res.send(movie);
});

router.put('/:id', auth, async (req, res)=>{
    const {error} = validateMovies(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genres.findById(req.body.genreID);
    if(!genre) return res.status(400).send('Invalid genre.');
    
    const movie = await Movies.findByIdAndUpdate(req.params.id, 
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

    const movie = await Movies.findByIdAndRemove(req.params.id)
    
    if(!movie) return res.status(404).send("given id not found");
    
    res.send(movie);
     

});

module.exports = router;