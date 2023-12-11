const { body } = require('express-validator');

function petAdoptionApplicationValidator(req, res, next) {
    return [
        body('applicationAddress')
            .trim()
            .notEmpty()
            .withMessage('applicationAddressError'),
    ];
}

module.exports = petAdoptionApplicationValidator();
