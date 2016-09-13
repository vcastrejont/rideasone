var Notification = require('../models/notification');

module.exports.get = function (req, res, next) {
  Notification.find({user: req.user._id})
    .sort('created_at')
    .skip(req.page * 10)
    .limit(10)
    .then(notifications => {
      res.json(notifications);
    })
    .then(() => {
      return Notification.update({status: 'SENT'}, {status: 'READ'});
    })
    .catch(next);
};

