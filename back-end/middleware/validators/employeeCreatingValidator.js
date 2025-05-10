const { body } = require('express-validator');

 function userCreatingValidation(req, res, next) {
    return [
        body('login')
            .trim()
            .notEmpty()
            .withMessage('loginIsNotExistError')
            .isLength({ min: 4, max: 35 })
            .withMessage('loginLengthError')
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('loginSymbolsError'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('emailIsNotExistError')
            .isEmail()
            .withMessage('emailIsNotCorrectError'),
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage('fullNameIsNotExistError')
            .matches(/\s/)
            .withMessage('fullNameIsNotCorrectError'),
        body('birthday')
            .trim()
            .notEmpty()
            .withMessage('birthDayIsNotExistError'),
        body('domainEmail')
            .trim()
            .isEmail()
            .withMessage('domainEmailIsNotCorrectError')
    ];
}

module.exports = userCreatingValidation();
