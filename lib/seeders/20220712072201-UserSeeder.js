'use strict';
const bcrypt = require('bcrypt');
const models = require('../models/index')

/**
 * Creates a dummy user with encrypted password.
 * username: ericqvarnstrom
 * password: Ostfralla123!!
 * email: ericqvarnstrom@gmail.com
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await bcrypt.hashSync("Ostfralla123!!", 6);

        await models.User.create({
            username: 'Ericqvarnstrom',
            email: 'ericqvarnstrom@gmail.com',
            password: password
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    }
};