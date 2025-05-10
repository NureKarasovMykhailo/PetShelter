const ApiError = require('../error/ApiError');
const getToken = require('./getToken');
const i18n = require('i18n');

module.exports = function (roles) {
    return  (req, res, next) => {
        let decodedToken = getToken(req, res, next);
        let hasAccess = false;
        if (decodedToken) {
            req.user = decodedToken;
            let userRoles = decodedToken.roles;
            userRoles.map(userRole => {
                roles.map(role => {
                    if (role === userRole) {
                        hasAccess = true;
                    }
                })
            });
            if (hasAccess){
                return next();
            }
            return next(ApiError.forbidden(i18n.__('accessDenied')));
        } else {
            next();
        }
    };
}