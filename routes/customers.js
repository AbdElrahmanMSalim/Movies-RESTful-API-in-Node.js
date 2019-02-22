const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Customers, validateCustomer} = require('../models/customers');

router.get('/', async(req, res) => {
    const customer = await Customers.find().sort('name');
    res.send(customer); 
});

router.get('/:id', async(req, res) => {
    const customer = await Customers.findById(req.params.id);
    if(!customer) {
        res.status(404).send("Not Found");
        return;
    }    
    res.send(customer);     
});

router.post('/', auth, async(req, res) =>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = new Customers({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    
    await customer.save();
    res.send(customer);     
});

router.put('/:id',auth, async(req, res) =>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    }, {new: true});
    
    if(!customer) return res.status(404).send("given id not found");

    res.send(customer);     
});

router.delete('/:id', auth, async(req, res) =>{
    const customer = await Customers.findByIdAndRemove(req.params.id);
    
    if(!customer) return res.status(404).send("given id not found");

    res.send(customer);     
});

module.exports = router;