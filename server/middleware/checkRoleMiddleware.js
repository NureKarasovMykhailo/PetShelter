const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const getToken = require('./getToken');
const {decode} = require("jsonwebtoken");

module.exports = function (roles) {
    return  (req, res, next) => {
        let decodedToken = getToken(req, res, next);
        if (decodedToken) {
            let roles = decodedToken.roles;
            roles.map(role => {
               if (role === 'subscriber') {
                   next();
               }
            });
            return next(ApiError.forbidden('You must subscribe for creating a shelter'));
        } else {
            next();
        }
    };
}
