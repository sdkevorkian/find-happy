var express = require('express');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();

// Routes

// put route for all addresses display here
router.get('/', isLoggedIn, function(req, res) {
    db.address.findAll({
        where: {
            userId: req.user.id,
        }
    }).then(function(addresses) {
        res.render('addresses/list-all', { addresses: addresses });
    }).catch(function(error) {
        res.status(400).render('main/error', { error: error });
    });
});

// display new address form (route here after signup)
router.get('/new', isLoggedIn, function(req, res) {
    var user = req.user;
    res.render('addresses/new', { user: user });
});

// add address to database
router.post('/', isLoggedIn, function(req, res) {
    var newUserId = req.user.id;
    var newName = req.body.name;
    var newAddress = req.body.address;

    db.address.findOrCreate({
        where: {
            address: newAddress,
            userId: newUserId
        },
        defaults: {
            name: newName
        }
    }).spread(function(address, wasCreated) {
        if (wasCreated) {
            // address created, not already existing with user
            res.redirect('/addresses');
        } else {
            req.flash('error', "you've already saved this address");
            res.redirect('/addresses/new');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/addresses/new');
    });
});

// Exports object
module.exports = router;
