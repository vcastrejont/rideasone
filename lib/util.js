var Place = require('../models/Place');
var error = require('./error');

exports.findOrCreatePlace = function (data, transaction){
  return Place.find({google_places_id: data.google_places_id})
    .then(place =>{
      if (!place.length){
        transaction.insert('place', data);
        return transaction.run();
      } else {
        return place;
      }
    })
    .catch(err => { throw new Error(error.toHttp(err))});
};


