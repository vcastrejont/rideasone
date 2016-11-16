var Notification = require('../models/notification');

module.exports.get = function (req, res, next) {
  Notification.find({user: req.user._id})
    .sort('created_at')
    .skip(req.page * 10)
    .limit(10)
    .populate('subject sender recipient')
    .then(notifications => {
      res.json(notifications);
    })
    .catch(next);
};

module.exports.markRead = function(req, res, next){
  Notification.update(
      {
        user: req.user._id, 
        _id: req.params.notification_id
      },{
        $set: {
          status: 'READ'
        }
     })
    .then(() => {
      res.send(200);
    })
    .catch(next);
};
