var passport = require('passport');

module.exports = {
  hasToken: passport.authenticate('jwt', { session: false }),
  isPassenger: isPassenger
};

function isPassenger (req, res, next) {
  if (!req.body.ride) return res.status(400).json({ message: 'ride id is required on field ride' });
  req.user.isPassenger(req.body.ride)
    .then((isPassenger) => {
      if (isPassenger) return next();
      return res.status(403).json({ message: 'User is not a passenger on this ride' });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
}
