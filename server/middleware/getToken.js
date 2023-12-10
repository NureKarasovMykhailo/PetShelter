const jwt = require('jsonwebtoken');
const ApiError = require("../error/ApiError");
const i18n = require('i18n');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized(i18n.__('nonAuthorized')));
        }
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
        return next(ApiError.unauthorized(i18n.__('nonAuthorized')));
    }
}