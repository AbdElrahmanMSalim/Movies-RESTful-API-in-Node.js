const request = require('supertest');
const { Genres } = require('../../models/genres');
const { Users } = require('../../models/users');

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../Vidly');
    });

    afterEach(async () => {
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            const genres = [
                { name: 'genre1' },
                { name: 'genre2' },
            ];
            
            await Genres.collection.insertMany(genres);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });
    
    describe('GET /api/:id', () => {
        it('should return a genre if a valid parameterized id', async () => {
            const genre = new Genres({
                name: 'genre1',
            });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id );
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        
        it('should return a genre if a invalid parameterized id', async () => {
            const res = await request(server).get('/api/genres/1');
            
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        async function exec(){
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }
        
        beforeEach(() => {
            token = new Users().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 error if genre is less than 5 chars', async () => {
            name = '1234';

            const res = await exec();
            
            expect(res.status).toBe(400);

        });
 
        it('should return 400 error if genre is more than 50 chars', async () => {
            name = new Array(52).join('a');

            const res = await exec();
            
            expect(res.status).toBe(400);
        });
 
        it('should save the genre if it is valid', async () => {
            await exec();

            const genre = await Genres.find({name: 'genre1'});

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
        
    });
});