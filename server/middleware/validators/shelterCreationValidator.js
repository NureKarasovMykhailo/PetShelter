const { body } = require('express-validator');
const i18n = require('i18n');

function shelterCreatingValidation(req, res, next) {
    return [
        body('shelterName')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('shelterNameError'))
            .isLength({ min: 5, max: 100 })
            .withMessage(i18n.__('shelterNameLengthError')),
        body('shelterCity')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('shelterCityError')),
        body('shelterStreet')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('shelterStreetError')),
        body('shelterHouse')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('shelterHouseError'))
            .matches(/^[\dA-Za-z\s/-]+$/)
            .withMessage(i18n.__('shelterHouseFormatError')),
        body('shelterDomain')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('shelterDomainError'))
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage(i18n.__('shelterDomainFormatError')),
        body('subscriberDomainEmail')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('subscriberDomainEmailError'))
            .matches(/^[a-zA-Z]+$/)
            .withMessage(i18n.__('subscriberDomainEmailFormatError'))
    ];
}

module.exports = shelterCreatingValidation;
