var express = require('express');
var isLoggedIn = require('../middleware/isLoggedIn');
var db = require('../models');
var router = express.Router();

// Routes

/*

        GETS

*/

// put route for all addresses display here
router.get('/', isLoggedIn, function(req, res) {
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
        res.status(400).render('main/error', { error: error });
    });
});

// display new address form (route here after signup)
router.get('/new', isLoggedIn, function(req, res) {
    var user = req.user;
    res.render('addresses/new', { user: user });
});

//display edit addresses form
router.get('/:id/edit', isLoggedIn, function(req, res) {
    var addressToEdit = req.params.id;

    db.address.findOne({
        where: {
            id: addressToEdit,
        }
    }).then(function(address) {
        res.render('addresses/edit', { address: address });
    }).catch(function(error) {
        res.render('main/error', { error: error });
    });

});


/*

        POSTS

*/

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

/*

        PUTS

*/

router.put('/:id', isLoggedIn, function(req, res) {
    var addressToFind = req.params.id;
    db.address.update({
        name: req.body.name,
        address: req.body.address
    }, {
        where: {
            id: addressToFind
        }
    }).spread(function(updatedCount) {
        res.redirect(303, '/addresses');
    }).catch(function(error) {
        res.render('main/error', { error: error });
    });
});

/*

        DELETES

*/

router.delete('/:id', isLoggedIn, function(req, res) {
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
