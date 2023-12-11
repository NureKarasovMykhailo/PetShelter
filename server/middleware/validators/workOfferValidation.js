const { body } = require('express-validator');

function workerCreationValidation(req, res, next){
    return [
        body('workTitle')
            .trim()
            .notEmpty()
            .withMessage('workTitleError'),
        body('workDescription')
            .trim()
            .notEmpty()
            .withMessage('workDescriptionError'),
        body('workEmail')
            .trim()
            .isEmail()
            .withMessage('workEmailError'),
        body('workTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage('workTelephoneError')
    ];
}

module.exports = workerCreationValidation();
