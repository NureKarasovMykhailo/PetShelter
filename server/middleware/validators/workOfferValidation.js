const {body} = require('express-validator');

function workerCreationValidation(req, res, next){
    return [
        body('workTitle')
            .trim()
            .notEmpty()
            .withMessage('Please enter title of your work'),
        body('workDescription')
            .trim()
            .notEmpty()
            .withMessage('Please enter description of work'),
        body('workEmail')
            .trim()
            .isEmail()
            .withMessage('Please enter correct email'),
        body('workTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage('Please enter correct phone number')
    ];
}

module.exports = workerCreationValidation();