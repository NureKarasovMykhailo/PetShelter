const { body } = require('express-validator');
const i18n = require("i18n");

function subscriberRegistrationValidation() {
    return [
        body('login')
            .trim()
            .notEmpty().withMessage(i18n.__('loginIsNotExistError'))
            .isLength({ min: 4, max: 35 }).withMessage(i18n.__('loginLengthError'))
            .matches(/^[a-zA-Z0-9]+$/).withMessage(i18n.__('loginSymbolsError')),

        body('email')
            .trim()
            .notEmpty().withMessage(i18n.__('emailIsNotExistError'))
            .isEmail().withMessage(i18n.__('emailIsNotCorrectError')),

        body('fullName')
            .trim()
            .notEmpty().withMessage(i18n.__('fullNameIsNotExistError'))
            .matches(/\s/).withMessage(i18n.__('fullNameIsNotCorrectError')),

        body('birthday')
            .trim()
            .notEmpty().withMessage(i18n.__('birthDayIsNotExistError')),

        body('phoneNumber')
            .trim()
            .isInt().withMessage(i18n.__('phoneNumberIsNotExistError'))
            .isLength({ min: 7, max: 15 }).withMessage(i18n.__('phoneNumberIsNotCorrectError')),

        body('password')
            .trim()
            .notEmpty().withMessage(i18n.__('passwordIsEmptyError'))
            .matches(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/).withMessage(i18n.__('passwordIsNotCorrectError')),

        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(i18n.__('passwordIsNotTheSameError'));
                }
                return true;
            }).withMessage(i18n.__('passwordIsNotTheSameError'))
    ];
}

module.exports = subscriberRegistrationValidation;
