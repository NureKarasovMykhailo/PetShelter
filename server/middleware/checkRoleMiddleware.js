const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');

module.exports = function (roles) {
    return  (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return next(ApiError.unauthorized('Non authorized user'));
            }
            let decodedToken = jwt.verify(token, process.env.SECRET_KEY);


            req.user = decodedToken;
            next();
        } catch (e) {
            return next(ApiError.unauthorized('Non authorized user'));
        }

    };
}
