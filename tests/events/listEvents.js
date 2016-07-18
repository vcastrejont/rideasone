var supertest = require('supertest-as-promised');
var port = process.env.PORT|| 3000;
var req = supertest('http://localhost:'+ port +'/api');
var assert = require('chai').assert;
var User = require('../../models/User');
var token, testUser;

describe('Event listing', function(){
  before(() => {
    return new User({name:'test', email:'test@test.com', provider_id: Date.now()})
      .save()
      .then((user) => { 
        testUser = user;
        return supertest('http://localhost:'+ port)
          .post('/auth/fakeAuthForTesting')
          .send({userId: testUser._id});
      })
      .then(res => {
        token = 'JWT '+ res.body.token;
      });
  });

  after(() => {
    return testUser.remove(); 
  });

  it('lists all events', () => {
    return req.get('/events')
      .set('Authorization', token)
      .expect(200)
      .then(res => {
        assert.isArray(res.body);
      });
  });
});
