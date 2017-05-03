var express = require('express');
var passport = require('../config/passport-config');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var bcrypt = require('bcrypt');
var router = express.Router();

// Routes

/*

          LOGIN

*/

router.get('/login', function(req, res) {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/profile',
    // change above to include first name of user
    // successFlash: "let's look for some local fun!",
    failureRedirect: '/auth/login',
    failureFlash: 'Oops, wrong login'
}));

/*

          SIGN UP

*/

router.get('/signup', function(req, res) {
    res.render('auth/signup');
});

router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'password': req.body.password,
            'birthdate': req.body.birthdate
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //sign up successful
            passport.authenticate('local', {
                successRedirect: '/addresses/new',
                //change to include first of user
                successFlash: 'We hope you find your happy, please add some addresses to search around',
                failureRedirect: '/auth/signup',
                failureFlash: 'unknown error occured, please try again'
            })(req, res, next);
        } else {
            req.flash('error', 'you seem to have an account already! please log in');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});

/*

    PROFILE

*/

router.get('/profile', isLoggedIn, function(req, res) {
    var user = req.user;
    res.render('auth/profile', { user: user });

});

router.get('/profile/:id/edit', isLoggedIn, function(req, res) {
    var user = req.user;
    res.render('auth/edit-profile', { user: user });
});

router.put('/profile/:id', isLoggedIn, function(req, res) {
    var userToEdit = req.user.id;

    db.user.findById(userToEdit).then(function(user) {
        user.firstName = req.body.firstName;
        user.birthdate = req.body.birthdate;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save().then(function() {
            res.redirect(303, '/auth/profile');
        }).catch(function(error) {
            res.render('error/error', { error: error });
        });
    });
});

/*

          LOG OUT

*/

router.get('/logout', function(req, res) {
    req.logout();
    // add name below
    req.flash('success', 'you logged out! see you later');
    res.redirect('/');
});

// Exports object
module.exports = router;
