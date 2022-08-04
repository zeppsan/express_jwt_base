var path = require('path');
const jwt = require('express-jwt');
const constants = require('../config/constants')

/* Extracts the JWT out of a request */
module.exports = function (req, res, next) {
    return jwt.expressjwt({
        secret: process.env.JWTSECRET,
        algorithms: ["HS256"],
        getToken: function fromHeader(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },
    })
    .unless({path: 
        [
            '/auth/login', 
            '/auth/register', 
            '/auth/refreshtoken', 
            '/auth/verifyemail'
        ]
    })
}