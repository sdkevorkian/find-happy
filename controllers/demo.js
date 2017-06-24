require('dotenv').config();
var yelp = require('yelp-fusion');
var express = require('express');
var geocoder = require('geocoder');
var router = express.Router();
var client = yelp.client(process.env.ACCESS_KEY);

router.get('/', function(req, res) {
    var searchTerms;
    if (req.query.otherSearch) {
        searchTerms = req.query.otherSearch;
    } else {
        searchTerms = req.query.search;
    }
    if (!searchTerms) {
        searchTerms = "happy hour";
    }
    var address = { name: '17753 25th ave ne, shoreline wa 98155' };
    var results;
    geocoder.geocode(address.name, function(err, data) {
        if (err) console.log(err);
        address.lat = data.results[0].geometry.location.lat;
        address.long = data.results[0].geometry.location.lng;
        client.search({
            term: searchTerms,
            latitude: address.lat,
            longitude: address.long,
            radius: 1610
        }).then(response => {
            results = response.jsonBody;
            res.render("addresses/map", { address: address, yelpSearch: results });
        }).catch(e => {
            res.render("error/error", { error: e });
        });
    });
});
module.exports = router;
