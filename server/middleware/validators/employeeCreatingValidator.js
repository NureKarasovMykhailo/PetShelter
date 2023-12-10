const { body } = require('express-validator');
const i18n = require('i18n');

function userCreatingValidation(req, res, next) {
    return [
        body('login')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('loginIsNotExistError'))
            .isLength({ min: 4, max: 35 })
            .withMessage(i18n.__('loginLengthError'))
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage(i18n.__('loginSymbolsError')),
        body('email')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('emailIsNotExistError'))
            .isEmail()
            .withMessage(i18n.__('emailIsNotCorrectError')),
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('fullNameIsNotExistError'))
            .matches(/\s/)
            .withMessage(i18n.__('fullNameIsNotCorrectError')),
        body('birthday')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('birthDayIsNotExistError')),
        body('domainEmail')
            .trim()
            .isEmail()
            .withMessage(i18n.__('domainEmailIsNotCorrectError'))
    ];
}

module.exports = userCreatingValidation;
