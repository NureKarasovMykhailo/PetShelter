const { body } = require('express-validator');
const i18n = require('i18n');

function petCreationValidator(req, res, next) {
    return [
        body('petName')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('petNameError')),
        body('petAge')
            .trim()
            .isInt()
            .withMessage(i18n.__('petAgeError')),
        body('petGender')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('petGenderError'))
            .custom((value) => {
                if (value !== 'male' && value !== 'female' && value != 'самець' && value != 'самка') {
                    throw new Error(i18n.__('petGenderInvalidError'));
                }
                return true;
            }),
        body('cellNumber')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('petCellNumberError'))
    ];
}

module.exports = petCreationValidator;
