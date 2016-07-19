var supertest = require('supertest-as-promised');
var port = process.env.PORT|| 3000;
var req = supertest('http://localhost:'+ port +'/api');
var assert = require('chai').assert;
var sinon = require('sinon');
var User = require('../../models/User');
var Event = require('../../models/Event');
var Place = require('../../models/Place');
var token, testUser, testEvent1, testEvent2, testPlace;

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
      testPlace = place;
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
    .then(event => {
       testEvent1 = event;
       return new Event({
         name: "feria del pollo Z", 
         description: "una feria de pollos", 
         address: "pollolandia", 
         location: "pollornia", 
         place: testPlace._id, 
         organizer: testUser._id, 
         category: "pollos", 
         datetime: new Date("2017-05-05T02:20:10Z"), 
         tags: ['feria', 'pollo']
       })
       .save();
     })
     .then(event => {
       testEvent2 = event;
     });
  });

  after(() => {
    return testUser.remove()
    .then(() => testEvent1.remove())
    .then(() => testEvent2.remove())
    .then(() => testPlace.remove()); 
  });

  it('returns an array of future events', () => {
    return Event.getCurrentEvents()
    .then(events => {
      assert.isArray(events);
      assert.lengthOf(events, 2);
    });
  });
  it('returns an array of past events', () => {
    var clock = sinon.useFakeTimers(new Date("2017-06-06T00:00:00Z").valueOf());
    return Event.getPastEvents()
    .then(events => {
      assert.isArray(events);
      assert.lengthOf(events, 2);
      clock.restore();
    });
  })
});
