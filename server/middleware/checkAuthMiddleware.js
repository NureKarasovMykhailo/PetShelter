const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

module.exports = function (req, res, next){
    let decodedToken = getToken(req, res, next);
    if (decodedToken) {
        req.user = decodedToken;
        next();
    } else {
        next();
    }
};