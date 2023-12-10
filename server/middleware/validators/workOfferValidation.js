const { body } = require('express-validator');
const i18n = require('i18n');

function workerCreationValidation(req, res, next){
    return [
        body('workTitle')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('workTitleError')),
        body('workDescription')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('workDescriptionError')),
        body('workEmail')
            .trim()
            .isEmail()
            .withMessage(i18n.__('workEmailError')),
        body('workTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage(i18n.__('workTelephoneError'))
    ];
}

module.exports = workerCreationValidation;
