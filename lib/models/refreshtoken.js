'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            })
        }
    }
    RefreshToken.init({
        userId: DataTypes.INTEGER,
        token: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'RefreshToken',
    });
    return RefreshToken;
};