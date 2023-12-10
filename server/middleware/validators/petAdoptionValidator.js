const { body } = require('express-validator');
const i18n = require('i18n');

function petAdoptionValidator(req, res, next) {
    return [
        body('adoptionPrice')
            .trim()
            .isDecimal()
            .withMessage(i18n.__('adoptionPriceError')),
        body('adoptionTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage(i18n.__('adoptionTelephoneError')),
        body('adoptionEmail')
            .trim()
            .isEmail()
            .withMessage(i18n.__('adoptionEmailError')),
        body('adoptionInfo')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('adoptionInfoError'))
    ];
}

module.exports = petAdoptionValidator;
