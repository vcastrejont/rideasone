var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
      res.render('rides/index', { 'Title': "Get a tide" });
});


module.exports = router;
