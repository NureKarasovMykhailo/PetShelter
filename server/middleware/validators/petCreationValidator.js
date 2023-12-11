const { body } = require('express-validator');

function petCreationValidator(req, res, next) {
    return [
        body('petName')
            .trim()
            .notEmpty()
            .withMessage('petNameError'),
        body('petAge')
            .trim()
            .isInt()
            .withMessage('petAgeError'),
        body('petGender')
            .trim()
            .notEmpty()
            .withMessage('petGenderError')
            .custom((value) => {
                if (value !== 'male' && value !== 'female' && value != 'самець' && value != 'самка') {
                    throw new Error('petGenderInvalidError');
                }
                return true;
            }),
        body('cellNumber')
            .trim()
            .notEmpty()
            .withMessage('petCellNumberError')
    ];
}

module.exports = petCreationValidator();
