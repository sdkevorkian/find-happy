var express = require('express');
var passport = require('../config/passport-config');
var db = require('../models');
var router = express.Router();

// Routes

/*

          LOGIN

*/

router.get('/login', function(req, res) {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    // change above to include first name of user
    successFlash: "let's look for some local fun!",
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
        console.log("user: " + user + "was created" + wasCreated);
        if (wasCreated) {
            //sign up successful
            passport.authenticate('local', {
                successRedirect: '/',
                //change to include first of user
                successFlash: 'We hope you find your happy',
                failureRedirect: '/auth/signup',
                failureFlash: 'unknown error occured, please try again'
            })(req, res, next);
        } else {
            req.flash('error', 'you seem to have an account already! please log in');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/auth/signup');
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
