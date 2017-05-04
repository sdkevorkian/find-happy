require('dotenv').config();
var yelp = require('yelp-fusion');
var express = require('express');
var db = require('../models');
var router = express.Router();
var client = yelp.client(process.env.ACCESS_KEY);

// display all of a user's favorites
router.get('/', function(req, res) {
    db.user.find({
        where: {
            id: req.user.id,
        }
    }).then(function(user) {
        user.getFavorites().then(function(favorites) {
            res.render('favorites/list-favs', { favorites: favorites });
        }).catch(function(error) {
            res.status(400).render('error/error', { error: error });
        });
    });
});

// add favorite to database
router.post('/', function(req, res) {

    db.favorite.findOrCreate({
        where: {
            yelpId: req.body.yelpId
        }
    }).spread(function(favorite, wasCreated) {
        db.user.findById(req.user.id)
            .then(function(user) {
                user.addFavorite(favorite)
                    .then(function(favorite) {
                        // add flash message here, if favorite you added it! if not, it was already there
                        res.redirect('back');
                    }).catch(function(err) {
                        res.render('error/error', { error: err });
                    });
            });
    });

});

// display details about this location
router.get('/:id', function(req, res) {

    //find yelp id by database, then with the results do business search to show details
});

// delete ONLY from userFavorites table where favoritesId = req.params.id and userId = req.user.id
router.delete('/:id', function(req, res) {

});



// Exports object
module.exports = router;
