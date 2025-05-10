const ApiError = require('../error/ApiError');
const getRoles = require('../middleware/getUserRoles');
const i18n = require('i18n');

module.exports = async function(req, res, next){
    const userRoles = await getRoles(req.user);
    if (userRoles.includes('employee')){
        return next(ApiError.forbidden(i18n.__('youCantSubscribe')));
    } else {
        next();
    }
}