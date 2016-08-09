var Event = require('../models/event');
var Place = require('../models/place');
var User = require('../models/user');
var Ride = require('../models/ride');
var mailerController = require('../controllers/mailerController');
var mongoose = require('mongoose');
var _ = require('lodash');

/**
 * eventController.js
 *
 * @description :: Server-side logic for managing events.
 */
module.exports = {
  /**
   * List all the events from yesterday to the end of the time.
   */
  getFuture: function (req, res) {
    Event.getCurrentEvents()
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * List all the events up to yesterday.
   */
  getPast: function (req, res) {
    Event.getPastEvents()
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.getByUser()
   */
  getByUser: function (req, res) {
    // TODO: Once passport is implemented, get the user from req.user
    var userId = req.params.user_id;

    User.findById(userId)
      .then(function (user) {
        return user.getEvents();
      })
      .then(function (events) {
        res.json(events);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
  * eventController.carbyuser()
  */
  carbyuser: function (req, res) {
    var eventId = req.body.event_id;
    var userId = req.body.user_id;
    var resultData = {};
    Event.findOne({_id: eventId}, function (err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error getting event.'
        });
      }
      if (!event) {
        return res.json(404, {
          message: 'No such event'
        });
      }
      event.cars.forEach(function (car, index) {
        if (car.driver_id === userId) {
          resultData = car;
        } else {
          car.passanger.forEach(function (passanger, index) {
            if (passanger.user_id === userId) {
              resultData = car;
            }
          });
        }
      });
      res.status(200).json(resultData);
    });
  },
  /**
   * eventController.getById()
   */
  getById: function (req, res) {
    var eventId = req.params.event_id;
    Event.findById(eventId)
    .populate('organizer')
    .populate('place')
    .populate({
      path: 'going_rides', 
      populate: {
        path: 'driver passengers',
        populate: {
          path: 'user place'
        }
      }
    })
    .then(function (event) {
      console.log(event);
      if (event)
          return res.json(event);
      else
          return res.send(404);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.create()
   */
  create: function (req, res) {
    var newEvent = _.pick(req.body, ['name', 'description', 'address', 'place', 'datetime', 'tags']);
    newEvent.place = _.pick(newEvent.place, ['name', 'address', 'google_places_id', 'location']);

    req.user.createEvent(newEvent)
     .then(function (event) {
        res.json({ _id: event._id });
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.remove()
  */
  remove: function (req, res) {
    req.event.remove()
      .then(function (event) {
        return res.json(event);
      })
      .catch(function (err) {
        res.status(500).json({ message: err.message });
      });
  },
  /**
   * eventController.drivers()
   */
  getDrivers: function (req, res) {
    var id = req.params.id;
    Event.aggregate([
      { $match: {
        'attendees.n_seats': {$exists: true},
        '_id': mongoose.Types.ObjectId(id)
      }},
      { $unwind: '$attendees' },
      { $match: {
        'attendees.n_seats': {$exists: true}
      }},
      { '$project': {
        '_id': 0,
        'attendees.user_id': 1,
        'attendees.user': 1,
        'attendees.n_seats': 1
      }}
    ], function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      return res.json(result);
    });
  },
  /**
   * eventController.byDriver()
   */
  byDriver: function (req, res) {
    var driverId = req.params.id;
    Event.find({'cars.driver_id': mongoose.Types.ObjectId(driverId)}, function (err, events) {
      if (err) {
        return res.json(500, {
          message: 'Error getting event.'
        });
      }
      return res.json(events);
    });
  },
  
  /**
   * eventController.addRide()
   */
  addRide: function (req, res) {
    var ride = _.pick(req.body, ['place', 'departure', 'seats', 'comments', 'going', 'returning']);

    req.body.driver = req.user._id;
    Event.findOne({_id: req.params.event_id})
    .then(function (event) {
      return event.addRide(ride);
    })
    .then(function (updatedEvents) {
      var numAffected = updatedEvents.length;
      return res.status(200).json({
        message: 'Successfully added!',
        numAffected: numAffected
      });
    })
    .catch(function(err){
        console.log(err);
        if (err) return res.json(500, { message: 'Error', error: err });
    });
  },
  edit: function (req, res) {
    var updates = _.pick(req.body, ['name', 'place', 'description', 'datetime', 'tags']); 
    _.assign(req.event, updates);
    
    req.event.save()
    .then(event => {
      return res.status(200).json({
        message: 'Successfully edited',
      });
    })
    .catch(err => {
      return res.status(500).json({
        message: 'Error editing event',
        error: err
      });
    });
  },

  /**
   * eventController.signup()  Event sign up
   */
  signup: function (req, res) {
    var id = req.params.id;
    var attendees = {
      user_id: req.user.id,
      user: req.user.name,
      photo: req.user.photo,
      lift: false,
      comments: req.body.comments
    };
    Event.findOne({_id: id}, function (err, event) {
      if (err) {
        return res.json(500, {
          message: 'Error accesing event', error: err
        });
      }
      if (!event) {
        return res.json(404, {message: 'No such event'});
      }
      Event.findOne({'_id': id, 'attendees.user_id': req.user.id}, function (err, attendee) {
        if (attendee) {
          console.log('Already exists');
          return res.json(200, {message: 'Already signed'});
        } else {
          Event.update({'_id': id}, {$push: {'attendees': attendees}}, function (err, numAffected) {
            if (err) {
              console.log(err);
            } else {
              console.log('Successfully added to event');
              return res.json(200, {message: 'Successfully added to event'});
            }
          });
        }
      });
    });
  },

  messageDriver: function(req, res) {
      var eventId = req.params.id;
      var carId = req.params.carId;
      if(!req.body.message) return res.json(400, { message: 'The message is required' });

      eventModel.findById(eventId, function(err, event) {
          if(err) return res.json(500, { message: 'Error getting event.' });

          var car = _.find(event.cars, function(car) {
              return car['_id'] == carId;
          });

          if(!car) return res.json(400, { message: 'Invalid car ID' });

          mailerController.messageDriver({
              driver_email: car.driver_email,
              content: req.body.message,
              user_email: req.user.email
          }, function (err, response) {
              if (err) return res.send(500, { message: 'Error sending message' });

              console.log("Mail sent to: " + car.driver_email);
              res.sendStatus(200);
          })

      });
  }
};
