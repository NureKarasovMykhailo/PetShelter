const { body } = require('express-validator');

function shelterCreatingValidation(req, res, next) {
    return [
        body('shelterName')
            .trim()
            .notEmpty()
            .withMessage('shelterNameError')
            .isLength({ min: 5, max: 100 })
            .withMessage('shelterNameLengthError'),
        body('shelterCity')
            .trim()
            .notEmpty()
            .withMessage('shelterCityError'),
        body('shelterStreet')
            .trim()
            .notEmpty()
            .withMessage('shelterStreetError'),
        body('shelterHouse')
            .trim()
            .notEmpty()
            .withMessage('shelterHouseError')
            .matches(/^[\dA-Za-z\s/-]+$/)
            .withMessage('shelterHouseFormatError'),
        body('shelterDomain')
            .trim()
            .notEmpty()
            .withMessage('shelterDomainError')
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage('shelterDomainFormatError'),
        body('subscriberDomainEmail')
            .trim()
            .notEmpty()
            .withMessage('subscriberDomainEmailError')
            .matches(/^[a-zA-Z]+$/)
            .withMessage('subscriberDomainEmailFormatError')
    ];
}

module.exports = shelterCreatingValidation();
