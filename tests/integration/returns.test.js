const moment = require('moment');
const winston = require('winston');
const mongoose = require('mongoose');
const request = require('supertest');
const { Rentals } = require('../../models/rentals');
const { Movies } = require('../../models/movies');
const { Users } = require('../../models/users');

describe('api/returns', () =>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = require('../../Vidly');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        token = new Users().generateAuthToken();

        movie = new Movies({
            _id: movieId,
            title: '12345',
            genre: {name: '12344'},
            numberInStock: 10,
            dailyRentalRate: 2
        });
        await movie.save();

        rental = new Rentals({
            customer: {
                _id: customerId,
                name: '12346',
                phone: '123456'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            } 
        });
        await rental.save();
    });

    afterEach(async () => { 
        await server.close(); 
        await Rentals.remove({});
        await Movies.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        
        const res = await exec();
        
        expect(res.status).toBe(401); 
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        
        const res = await exec();
        
        expect(res.status).toBe(400); 
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();
        
        expect(res.status).toBe(400); 
    });

    it('should return 404 if no rental found for the given cutomer\movie combintaion', async () => {
        await Rentals.remove({});

        const res = await exec();
        
        expect(res.status).toBe(404); 
    });

    it('should return 400 if the return date is set', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();
        
        expect(res.status).toBe(400); 
    });

    it('should return 200 if valid request', async () => {
        const res = await exec();
        
        expect(res.status).toBe(200); 
    });

    it('should set input date if input is valid', async () => {
        await exec();
        
        const rentalInDb = await Rentals.findOne(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000); 
    });

    it('should set rental fee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
                
        await exec();
        
        const rentalInDb = await Rentals.findOne(rental._id);

        expect(rentalInDb.rentalFee).toBe(14); 
    });

    it('should increase the stock for a movie if input is valid', async () => {                
        await exec();
        
        const movieInDb = await Movies.findOne(movie._id);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); 
    });

    it('should return the rental in the body of response', async () => {                
        const res = await exec();
        
        const rentalInDb = await Rentals.findOne(rental._id);

        expect(Object.keys(res.body)).toEqual
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
            'cusotmer', 'movie']);
    });

});

