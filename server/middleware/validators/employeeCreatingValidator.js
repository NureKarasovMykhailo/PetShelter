const {body} = require('express-validator');

function userCreatingValidation(req, res, next) {
    return [
        body('login')
            .trim()
            .notEmpty()
            .withMessage('Please enter login')
            .isLength({ min: 4, max: 35 })
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
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage('Please enter a valid birthday'),
        body('domainEmail')
            .trim()
            .notEmpty()
            .withMessage('Please enter domain email')
            .isEmail()
            .withMessage('Please enter correct domain email')
    ];
}

module.exports = userCreatingValidation();