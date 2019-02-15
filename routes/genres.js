const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genres} = require('../models/genres')


router.get('/', async (req, res)=>{
    const genres = await Genres.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res)=>{
    const genre = await Genres.findById(req.params.id);
    if(!genre) res.status(404).send("Not Found");
    res.send(genre);

});

router.post('/', auth,  async (req, res)=> {
    if(!req.body.name){
        res.status(404).send("badRequest");
        return;
    } 

    const genre = new Genres({
        name: req.body.name
    });
    await genre.save();

    res.send(genre);
});

router.put('/:id', auth, async (req, res)=>{
    if (!req.body.name) return res.status(404).send("name is required");    

    const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true})
    
    if(!genre) return res.status(404).send("given id not found");
    
    res.send(genre);     

});

router.delete('/:id', auth, async (req, res)=>{

    const genre = await Genres.findByIdAndRemove(req.params.id)
    
    if(!genre) return res.status(404).send("given id not found");
    
    res.send(genre);
     

});

module.exports = router;