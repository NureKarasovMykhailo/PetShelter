const ApiError = require('../error/ApiError');

module.exports = async function (req, res, next) {
    const shelterId = req.user.shelterId;
    if (!shelterId) {
        return next(ApiError.badRequest('You do not have a shelter'));
    }
    return next();
}