var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var fcm = require('../lib/fcm');
var frd = require('../lib/frd');
var fcmInstance = fcm.instance;
var _ = require('lodash');
var Promise = require('bluebird');

var Status = ["PENDING", "SENT", "ERROR"];

var NotificationSchema = new Schema({
  user: ObjectId,
  status: { type: Number, default: "PENDING", enum: Status },
  type: String,
  subject: ObjectId,
  message: String,
  created_at: {type: Date, default: Date.now}
});

NotificationSchema.addNotification = function (data) {
  var tokens = _.get(data, 'recipient.tokens');
  var promise = Promise.resolve(); 

  promise.then(() => {
    return this.insert({
      user: data.recipient.id,
      status: 0, 
	    type: data.type,
	    subject: data.subject,
      message: data.message
    })
  })
  .catch(error.toHttp)
  .then(notification => {
    return frd.ref('notifications').child(notification.user)
      .transaction(value => value === null ? 0 : value + 1);
  });
 
  if(tokens && tokens.length){	
    promise.then(() => {
	  return fcm.send({
      to: tokens,
	    message: data.message
	  });
	});
  }
 //ToDo: Send notification to socket 
  return promise; 
 
}

var Notification = mongoose.model('Notification', Notification);

module.exports = Notification;

