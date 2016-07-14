var passport = require('passport');

module.exports = {
  isAuthenticated: passport.authenticate('jwt', { session: false }),
  isPassenger: isPassenger,
  isOrganizer: isOrganizer
};

function isPassenger (req, res, next) {
  var rideId = req.body.ride_id || req.params.ride_id;
  if (!rideId) return res.status(400).json({ message: 'ride_id is required`' });
  req.user.isPassenger(rideId)
    .then((ride) => {
      req.ride = ride;
      return next();
    })
    .catch((err) => {
      return res.status(err.status || 500).json(err);
    });
}

function isOrganizer (req, res, next) {
  var eventId = req.body.event_id || req.params.event_id;
  if (!eventId) return res.status(400).json({ message: 'event_id is required' });
  req.user.isOrganizer(eventId)
    .then((event) => {
      req.event = event;
      return next();
    })
    .catch((err) => {
      return res.status(err.status || 500).json(err);
    });
}
