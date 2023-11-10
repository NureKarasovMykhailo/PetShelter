const {body} = require('express-validator');

function petAdoptionValidator(req, res, next){
    return [
        body('adoptionPrice')
            .trim()
            .isDecimal()
            .withMessage('Please enter correct price for pet adoption'),
        body('adoptionTelephone')
            .trim()
            .matches(/^\+\d{12}$/)
            .withMessage('Please enter correct phone number'),
        body('adoptionEmail')
            .trim()
            .isEmail()
            .withMessage('Please enter correct email address'),
        body('adoptionInfo')
            .trim()
            .notEmpty()
            .withMessage('Please enter information about pet adoption')
    ];
}

module.exports = petAdoptionValidator();