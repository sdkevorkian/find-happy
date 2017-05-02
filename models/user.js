'use strict';
var bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "please enter a valid email."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [6, 32],
                    msg: "password must be between 6 and 32 characters long."
                }
            }
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            validate: {
                is18: function(birthdate) {
                    var today = new Date();
                    var DOB = new Date(birthdate);
                    var age = today.getFullYear() - DOB.getFullYear();
                    var m = today.getMonth() - DOB.getMonth();
                    if (m < 0 || today.getDate() < DOB.getDate()) {
                        age--;
                    }

                    if (age < 18) {
                        throw new Error('you must be over 18!');
                    }
                }
            }
        },
        firstName: DataTypes.STRING
    }, {
        hooks: {
            beforeCreate: function(user, options, cb) {
                if (user && user.password) {
                    var hash = bcrypt.hashSync(user.password, 10);
                    user.password = hash;
                }
                cb(null, user);
            }
        },
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.user.hasMany(models.address);
            }
        },
        instanceMethods: {
            isValidPassword: function(passwordTyped) {
                return bcrypt.compareSync(passwordTyped, this.password);
            },
            toJSON: function() {
                var data = this.get();
                delete data.password;
                return data;
            }
        }
    });
    return user;
};
