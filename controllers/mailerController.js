

/**
 * mailerController.js
 *
 * @description :: Server-side logic for sending emails.
 */
 var nodemailer = require('nodemailer');
 var config = require('../config/config.js');
 var transporter = nodemailer.createTransport( {
     service:  config.mailer.service,
     auth: { 
      user: config.mailer.user,
      pass: config.mailer.pass 
     }
 });
module.exports = {
    /**
     * mailerController.joinCar()
     */
    joinCar: function(user_name, event_name, driver_email) {
      var html_text = 'Hello, <br> <p>This message is to inform you that have a new passenger in your car for the event: <b>'+ event_name +'</b></p>';
      html_text +='<p>You new passenger name is: <b> ' + user_name+'</b></p>';
      html_text +='<p>The carpooling app</p>';
      var mailOpts = {
          from: config.mailer.from,
          to: driver_email,
          subject: 'You have a new passanger',
          text : 'You have a new passanger',
          html : html_text
      };
      transporter.sendMail(mailOpts, function (err, response) {
          if (err) {
           console.log(err);
          } else {
           console.log("Mail send to: " +mailOpts.to);
          }
      });
    },
    
    leaveCar: function(user_name, event_name, driver_email) {
      var html_text = 'Hello, <br> <p>This message is to inform you that <b>'+ user_name+'</b> has left your car for the event: <b>'+ event_name +'</b></p>';
      html_text +='<p>The carpooling app</p>';
      
      var mailOpts = {
          from: config.mailer.from,
          to: driver_email,
          subject: 'A passanger has left your car',
          text : 'A passanger has left your car',
          html : html_text
      };
      transporter.sendMail(mailOpts, function (err, response) {
          if (err) {
           console.log(err);
          } else {
           console.log("Mail send to: " +mailOpts.to);
          }
      });
    }
};
