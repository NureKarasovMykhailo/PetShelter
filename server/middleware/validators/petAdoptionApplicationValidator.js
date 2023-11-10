const {body} = require('express-validator');

function petAdoptionApplicationValidator(req, res, next){
    return [
        body('applicationName')
            .trim()
            .notEmpty()
            .withMessage('Please enter your full name'),
        body('applicationAddress')
            .trim()
            .notEmpty()
            .withMessage('Please enter your home address'),
        body('applicationEmail')
            .trim()
            .isEmail()
            .withMessage('Please enter correct email address'),
        body('applicationTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage('Please enter correct telephone number')
    ];
}

module.exports = petAdoptionApplicationValidator();