

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
          subject: 'You have a new passenger',
          text : 'You have a new passenger',
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
          subject: 'A passenger has left your car',
          text : 'A passenger has left your car',
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
    shareEvent: function(targetEmail, eventName, linkUrl, message) {
        //TODO use a template
        var htmlText = 'Hello, <br> <p>An event has been shared with you: <b><a href="' + linkUrl + '">' + eventName + '</a></b></p>';
        htmlText += '<p>' + message +'</p>';
        htmlText += '<p>The carpooling app</p>';

        var mailOpts = {
            from: config.mailer.from,
            to: targetEmail,
            subject: 'Someone shared you an event',
            text : htmlText,
            html : htmlText
        };
        transporter.sendMail(mailOpts, function (err, response) {
            if (err) {
                console.log(err);
            } else {
                console.log("Mail sent to: " + targetEmail);
            }
        });
    }
}
;
