var express = require('express');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');

var router = express.Router();



router.get('/', function(req, res) {
    res.render('map/map');
});




// Exports object
module.exports = router;
