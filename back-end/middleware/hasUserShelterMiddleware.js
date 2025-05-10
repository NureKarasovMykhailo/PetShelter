const ApiError = require('../error/ApiError');
const i18n = require('i18n');

module.exports = async function (req, res, next) {
    const shelterId = req.user.shelterId;
    if (!shelterId) {
        return next(ApiError.badRequest(i18n.__('youDontHaveShelter')));
    }
    return next();
}