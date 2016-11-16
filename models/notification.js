var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var fcm = require('../lib/fcm').instance;
var frd = require('../lib/frd');
var fcmInstance = fcm.instance;
var _ = require('lodash');
var Promise = require('bluebird');
var error = require('../lib/error');

var Status = ["PENDING", "SENT", "READ", "ERROR"];

var NotificationSchema = new Schema({
  user: ObjectId,
  status: {type: String, default: "PENDING", enum: Status},
  type: String,
  subject: ObjectId,
  message: String,
  created_at: {type: Date, default: Date.now}
});

NotificationSchema.statics.addNotification = function (data, transaction) {
  var tokens = _.get(data, 'recipient.tokens');
  var promise = Promise.resolve(); 

  promise.then(() => {
    transaction.insert('notification', {
      user: data.recipient.id,
      status: 'SENT', 
	    type: data.type,
	    subject: data.subject,
      message: data.message
    });
    return transaction.run();
  })
  .then(notifications => {
    return frd.ref('notifications').child(data.recipient.id)
      .transaction(value => value === null ? 1 : value + 1);
  });
 
  if(tokens && tokens.length){	
    promise.then(() => {
      return fcm.send({
        to: tokens,
        notification: {
          body: data.message
        }
      });
    });
  }
  return promise; 
 
}

var Notification = mongoose.model('notification', NotificationSchema);

module.exports = Notification;

