var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
      res.render('myroutes/index', { 'Title': "My routes" });
});


module.exports = router;
