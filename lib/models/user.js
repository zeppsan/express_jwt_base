'use strict';
const { Model } = require('sequelize');
const models = require('./index')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.hasOne(models.RefreshToken, {
                as: 'refreshToken',
                foreignKey: 'id',
                onDelete: 'cascade'
            })
            this.hasMany(models.Verifications, {
                as: 'verifications',
                foreignKey: 'id',
                onDelete: 'cascade'
            })
        }
    }
    User.init({
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        email_verified: DataTypes.BOOLEAN,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        scopes: {
            safe: {
                attributes: {
                    exclude: ['password', 'email_verified', 'updatedAt']
                }
            }
        }
    });
    return User;
};