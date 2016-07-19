var supertest = require('supertest-as-promised');
var port = process.env.PORT|| 3000;
var req = supertest('http://localhost:'+ port +'/api');
var assert = require('chai').assert;
var User = require('../../models/User');
var Event = require('../../models/Event');
var Place = require('../../models/Place');
var token, testUser;

describe('Event listing', function(){
  before(() => {
    return new User({
      name:'test', 
      email:'test@test.com', 
      provider_id: Date.now()
    })
    .save()
    .then(user => { 
      testUser = user;
      return supertest('http://localhost:'+ port)
        .post('/auth/fakeAuthForTesting')
        .send({userId: testUser._id});
    })
    .then(res => {
      token = 'JWT '+ res.body.token;
    })
    .then(() => {
      return new Place({
        address: 'avenida Siempreviva #43', 
        place_name: "ferialandia", 
        location: { lat: 123, lon: 123 }
      })
      .save();
    })
    .then(place => {
      return new Event({
        name: "feria del pollo", 
        description: "una feria de pollos", 
        address: "pollolandia", 
        location: "pollornia", 
        place: place._id, 
        organizer: testUser._id, 
        category: "pollos", 
        datetime: new Date("2017-05-05T02:20:10Z"), 
        tags: ['feria', 'pollo']
       })
       .save();
     })
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
