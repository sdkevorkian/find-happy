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
        user.getFavorites({
            order: [
                ["createdAt", "ASC"]
            ]
        }).then(function(favorites) {
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
                        // add below flash message, if favorite you added it! if not, it was already there... need to read documentation better
                        // req.flash("you've added this already", error.message);
                        res.redirect('back');
                    }).catch(function(err) {
                        console.log(err)
                        res.render('error/error', { error: err });
                    });
            });
    });

});

// display details about this location
router.get('/:id', function(req, res) {
    var numFavorited;

    db.userFavorites.findAndCountAll({
        where: {
            favoriteId: req.params.id,
        }
    }).then(function(result) {
        numFavorited = result.count;
        db.favorite.findById(req.params.id)
            .then(function(favorite) {
                client.business(favorite.yelpId)
                    .then(function(response) {

                        res.render('favorites/display', { favorite: response.jsonBody, numFavorited: numFavorited });
                    }).catch(function(err) {
                        res.render('error/error', { error: err });
                    });
            });

    });



});

// delete ONLY from userFavorites table where favoritesId = req.params.id and userId = req.user.id
router.delete('/:id', function(req, res) {
    db.userFavorites.destroy({
        where: {
            favoriteId: req.params.id,
            userId: req.user.id,
        }
    }).then(function() {
        res.status(204).redirect('/favorites');
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/favorites');
    });
});



// Exports object
module.exports = router;