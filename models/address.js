'use strict';
var geocoder = require('geocoder');
module.exports = function(sequelize, DataTypes) {
    var address = sequelize.define('address', {
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        long: DataTypes.FLOAT,
        userId: DataTypes.INTEGER
    }, {
        hooks: {
            beforeCreate: function(place, options, cb) {
                geocoder.geocode(place.address, function(err, data) {
                    if (err) return cb(err, null);
                    console.log(err, data);
                    place.lat = data.results[0].geometry.location.lat;
                    place.long = data.results[0].geometry.location.lng;
                    cb(null, place);
                });
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.address.belongsTo(models.user);
            }
        }
    });
    return address;
};
