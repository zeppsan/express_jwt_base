'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Verifications extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            })
        }
    }
    Verifications.init({
        userId: DataTypes.INTEGER,
        verificationType: DataTypes.STRING,
        email: DataTypes.STRING,
        number: DataTypes.STRING,
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Verifications',
    });
    return Verifications;
};