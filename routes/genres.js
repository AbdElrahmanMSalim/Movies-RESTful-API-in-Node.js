const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Genres, validateGenre} = require('../models/genres')
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const genres = await Genres.find().sort('name');

    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res)=>{
    const genre = await Genres.findById(req.params.id);

    if(!genre) return res.status(404).send("Not Found");

    res.send(genre);
});

router.post('/', auth, async (req, res)=> {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genres({ name: req.body.name });
    await genre.save();

    res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res)=>{
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true})
    
    if(!genre) return res.status(404).send("given id not found");
    
    res.send(genre);     
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res)=>{
    const genre = await Genres.findByIdAndRemove(req.params.id)
    
    if(!genre) return res.status(404).send("given id not found");
    
    res.send(genre);
});

module.exports = router;