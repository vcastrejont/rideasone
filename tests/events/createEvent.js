var supertest = require('supertest-as-promised');
var assert = require('chai').assert;
var User = require('../../models/User');
var Place = require('../../models/Place');
var Event = require('../../models/Event');
var token, testUser, testPlace, createdEven, createdEvent;

describe('Event creation', function(){
  before(() => {
    return new User({
      name:'test', 
      email:'test@test.com', 
      provider_id: Date.now()
    })
    .save()
    .then(user => {
      testUser = user;
      return new Place({
        address: 'avenida Siempreviva #43', 
        place_name: "ferialandia", 
        location: { lat: 123, lon: 123 }
      })
      .save();
    })
    .then(place => {
      testPlace = place;
    });
  });

  after(() => {
    return testUser.remove()
    .then(() => testPlace.remove()) 
    .then(() => Event.remove(createdEvent));
  });

  it('creates a new event with existing place', () => {
    return testUser.createEvent({
      name: "feria del pollo Z", 
      description: "una feria de pollos", 
      address: "pollolandia", 
      location: "pollornia", 
      place: testPlace._id, 
      organizer: testUser._id, 
      datetime: new Date("2017-05-05T02:20:10Z"), 
      tags: ['feria', 'pollo']
    })
    .then(event => {
      createdEvent = event;
      assert.ok(event._id);
      assert.equal(Date(event.datetime), Date("2017-05-05T02:20:10Z"));
      assert.equal(event.name, 'feria del pollo Z');
      assert.equal(event.description, 'una feria de pollos');
      assert.lengthOf(event.going_rides, 0);
      assert.lengthOf(event.returning_rides, 0);
      assert.equal(event.organizer._id, testUser._id);
      assert.equal(event.place.toString(), testPlace._id.toString());
      assert.equal(event.tags[0], 'feria');
      assert.equal(event.tags[1], 'pollo');
    });
  })

  it('creates a new place from data given for new event', () => {
    
  });

});
