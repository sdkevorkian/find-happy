var geocoder = require('geocoder');

var place = { address: '17753 25th ave ne shoreline WA' };

function beforeCreate(place) {
    geocoder.geocode(place.address, function(err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        place.lat = data.results[0].geometry.location.lat;
        place.long = data.results[0].geometry.location.lng;
        console.log(place);
    });
}

beforeCreate(place);
