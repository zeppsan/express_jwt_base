const models = require('../models/index')

/**
 * Dummy service for users. 
 */
exports.getAllUsers = async () => {
    const result = await models.User.findAll();
    return result;
}
