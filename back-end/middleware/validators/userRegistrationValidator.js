const { body } = require('express-validator');

function userRegistrationValidator(req, res, next) {
    return [
        body('login')
            .trim()
            .notEmpty().withMessage('loginIsNotExistError')
            .isLength({ min: 4, max: 35 }).withMessage('loginLengthError')
            .matches(/^[a-zA-Z0-9]+$/).withMessage('loginSymbolsError'),

        body('email')
            .trim()
            .notEmpty().withMessage('emailIsNotExistError')
            .isEmail().withMessage('emailIsNotCorrectError'),

        body('fullName')
            .trim()
            .notEmpty().withMessage('fullNameIsNotExistError')
            .matches(/\s/).withMessage('fullNameIsNotCorrectError'),

        body('birthday')
            .trim()
            .notEmpty().withMessage('birthDayIsNotExistError'),

        body('phoneNumber')
            .trim()
            .isInt().withMessage('phoneNumberIsNotExistError')
            .isLength({ min: 7, max: 15 }).withMessage('phoneNumberIsNotCorrectError'),

        body('password')
            .trim()
            .notEmpty().withMessage('passwordIsEmptyError')
            .matches(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/).withMessage('passwordIsNotCorrectError'),

        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('passwordIsNotTheSameError');
                }
                return true;
            }).withMessage('passwordIsNotTheSameError')
    ]
}

module.exports = userRegistrationValidator();


