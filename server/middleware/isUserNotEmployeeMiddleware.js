const ApiError = require('../error/ApiError');
const getRoles = require('../middleware/getUserRoles');

module.exports = async function(req, res, next){
    const userRoles = await getRoles(req.user);
    if (userRoles.includes('employee')){
        return next(ApiError.forbidden('You can\'t subscribe using shelter\'s account. Please register your own account'));
    } else {
        next();
    }
}