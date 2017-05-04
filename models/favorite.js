'use strict';
module.exports = function(sequelize, DataTypes) {
    var favorite = sequelize.define('favorite', {
        yelpId: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.favorite.belongsToMany(models.user, { through: models.userFavorites });
            }
        }
    });
    return favorite;
};
