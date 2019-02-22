const auth = require('../../../middleware/auth');
const { Users } = require('../../../models/users');
const mongoose = require('mongoose');


describe('auth middleware', () => {
    it('should return 200 if a valid json object if a valid token', () => {
        const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const token = new Users(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();

        auth(req, res, next);
        
        expect(req.user).toMatchObject(user)
    });
});