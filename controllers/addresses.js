require('dotenv').config();
var yelp = require('yelp-fusion');
var express = require('express');
var db = require('../models');
var geocoder = require('geocoder');
var router = express.Router();
var client = yelp.client(process.env.ACCESS_KEY);
// Routes

/*

        GETS

*/

// put route for all addresses display here
router.get('/', function(req, res) {
    db.address.findAll({
        where: {
            userId: req.user.id,
        },
        order: [
            ['id', 'ASC']
        ]
    }).then(function(addresses) {
        res.render('addresses/list-all', { addresses: addresses });
    }).catch(function(error) {
        res.status(400).render('error/error', { error: error });
    });
});

// display new address form (route here after signup)
router.get('/new', function(req, res) {
    var user = req.user;
    res.render('addresses/new', { user: user });
});

// get route for specific address (will display map with yelp data on that page)
router.get('/:id', function(req, res) {
    var results;
    db.address.findOne({
        where: {
            id: req.params.id,
        }
    }).then(function(address) {
        client.search({
            term: req.query.search,
            latitude: address.lat,
            longitude: address.long,
            radius: 1610 // ~ a mile
        }).then(response => {
            results = response.jsonBody;
            res.render('addresses/map', { address: address, yelpSearch: results });
        }).catch(e => {
            res.render('error/error', { error: e });
        });
    });
});



//display edit addresses form
router.get('/:id/edit', function(req, res) {
    var addressToEdit = req.params.id;

    db.address.findOne({
        where: {
            id: addressToEdit,
        }
    }).then(function(address) {
        res.render('addresses/edit', { address: address });
    }).catch(function(error) {
        res.render('error/error', { error: error });
    });

});


/*

        POSTS

*/

// add address to database
router.post('/', function(req, res) {
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

/*

        PUTS

*/

router.put('/:id', function(req, res) {
    var addressToFind = req.params.id;
    var newLat;
    var newLong;
    geocoder.geocode(req.body.address, function(err, data) {
        if (err) console.log(err);
        newLat = data.results[0].geometry.location.lat;
        newLong = data.results[0].geometry.location.lng;

        db.address.update({
            name: req.body.name,
            address: req.body.address,
            lat: newLat,
            long: newLong
        }, {
            where: {
                id: addressToFind
            }
        }).spread(function(updatedCount) {
            res.redirect(303, '/addresses');
        }).catch(function(error) {
            res.render('error/error', { error: error });
        });
    });
});

/*

        DELETES

*/

router.delete('/:id', function(req, res) {
    var addressToDelete = req.params.id;

    db.address.destroy({
        where: {
            id: addressToDelete
        }
    }).then(function() {
        res.status(204).redirect('/addresses');
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/addresses');
    });
});

// Exports object
module.exports = router;
