var supertest = require('supertest');
var port = process.env.PORT|| 3000;
var authentication = process.env.AUTHENTICATION;
var req = supertest('localhost:'+ port +'/api/');
var assert = require('assert');

it('lists all events', () => {
    return req.get('/events')
        .set('Authorization', authentication)
        .expect(200);/*
        .then((res) => {
            assert(res.body).isArray();
        });
        */
});
