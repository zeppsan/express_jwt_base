const userServices = require('../services/userServices');
const models = require('../models/index');

/* 
    This controller is just added for demostration. Just ad 
    functionality according to your liking. 
*/
exports.getUsers = async (req, res) => {
    const result = await userServices.getAllUsers();
    return res.json(result);
}