const request = require('supertest');
const { Genres } = require('../../models/genres');

describe('auth middleware', () =>{  
    let server;  
    beforeEach(() => { server = require('../../Vidly'); });
    afterEach(async () => { 
        await server.close(); 
        await Genres.remove({});
    });

    let token; 

    function exec(){
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 401 if invalid token', async () => {
        token = '1';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid token', async () => {        
        const res = await exec();

        expect(res.status).toBe(400);
    });
});