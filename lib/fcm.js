var FCM = require('fcm-push-notif');
var config = require('../config/config');

var fcm = new FCM(config.fcm.api_key);

exports.instance = fcm;
exports.defaultMessage = {
  badge: 'urlToRideAsOneIcon',
  click_action: '' 
};



