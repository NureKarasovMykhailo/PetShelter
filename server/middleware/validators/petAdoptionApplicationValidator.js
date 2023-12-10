const { body } = require('express-validator');
const i18n = require('i18n');

function petAdoptionApplicationValidator(req, res, next) {
    return [
        body('applicationAddress')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('applicationAddressError')),
    ];
}

module.exports = petAdoptionApplicationValidator;
