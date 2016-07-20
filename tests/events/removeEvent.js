var supertest = require('supertest-as-promised');
var assert = require('chai').assert;
var port = process.env.PORT|| 3000;
var req = supertest('http://localhost:'+ port +'/api');
var util = require('../util');
var User = require('../../models/User');
var Place = require('../../models/Place');
var Event = require('../../models/Event');
var token, testUser, testEvent;

describe('Event removal', function(){
  before(() => {
    return new User({
      name:'test', 
      email:'test@test.com', 
      provider_id: Date.now()
    })
    .save()
    .then(user => { 
      testUser = user;
      return util.getTokenForUser(user._id);
    })
    .then(_token => {
      token = _token; 
      return new Event({
        name: "feria del pollo Z", 
        description: "una feria de pollos", 
        address: "pollolandia", 
        location: "pollornia", 
        organizer: testUser._id, 
        datetime: new Date("2017-05-05T02:20:10Z"), 
        tags: ['feria', 'pollo']
      })
      .save();
    })
    .then(event => {
      testEvent = event;
    });
  });

  after(() => {
    return testUser.remove()
    .then(() => testEvent.remove());
  });

  it('removes an event organized by requesting user', () => {
      return req.delete('/events/'+ testEvent._id)
        .set('Authorization', token)
        .expect(200)
        .then(res => {
          var event = res.body;
          assert.equal(event._id, testEvent._id);
        });   
  });

});
