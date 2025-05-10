const { body } = require('express-validator');

function petAdoptionValidator(req, res, next) {
    return [
        body('adoptionPrice')
            .trim()
            .isDecimal()
            .withMessage('adoptionPriceError'),
        body('adoptionTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage('adoptionTelephoneError'),
        body('adoptionEmail')
            .trim()
            .isEmail()
            .withMessage('adoptionEmailError'),
        body('adoptionInfo')
            .trim()
            .notEmpty()
            .withMessage('adoptionInfoError')
    ];
}

module.exports = petAdoptionValidator();
