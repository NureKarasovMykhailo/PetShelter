const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const getToken = require('./getToken');
const {decode} = require("jsonwebtoken");

module.exports = function (roles) {
    return  (req, res, next) => {
        let decodedToken = getToken(req, res, next);
        if (decodedToken) {
            let userRoles = decodedToken.roles;
            let haveAccess = false;
            userRoles.map(userRole => {
               roles.map(role => {
                   if (userRole === role) {
                       haveAccess = true;
                   }
               });
            });
            if (haveAccess) {
                req.user = decodedToken;
                next();
            } else {
                next(ApiError.forbidden('Access dined'));
            }
        } else {
            next();
        }
    };
}
