const {body} = require('express-validator');

function petAdoptionApplicationValidator(req, res, next){
    return [
        body('applicationAddress')
            .trim()
            .notEmpty()
            .withMessage('Please enter your home address'),
    ];
}

module.exports = petAdoptionApplicationValidator();