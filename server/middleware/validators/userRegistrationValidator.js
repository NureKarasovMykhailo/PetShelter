const {body} = require('express-validator');

function subscriberRegistrationValidation(req, res, next) {
    return [
        body('login')
            .trim()
            .notEmpty()
            .withMessage('Please enter the login')
            .isLength({min: 4, max: 35})
            .withMessage('Login must be from 4 to 35 letters')
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('Login must contain only Latin symbols'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Please enter your email')
            .isEmail()
            .withMessage('Please enter a correct email'),
        body('fullName')
            .trim()
            .notEmpty()
            .withMessage('Please enter your full name')
            .matches(/\s/)
            .withMessage('Your name must consist of two words'),
        body('birthday')
            .trim()
            .notEmpty()
            .withMessage('Please enter your birthday')
            .matches(/^\+\d{12}$/)
            .withMessage('Please enter a valid birthday'),
        body('phoneNumber')
            .trim()
            .isInt()
            .withMessage('Please enter your phone number')
            .isLength({min: 7, max: 15})
            .withMessage('Phone number must be from 7 to 15 symbols'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Please enter password')
            .matches(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
            .withMessage('Password must contain at least 8 symbols,' +
                ' 1 upper case symbol and 1 special symbol'),
        body('passwordConfirm')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Password not equal to confirm password')
                }
                return true
            })
    ];
}

module.exports = subscriberRegistrationValidation();