const { body } = require('express-validator');
const i18n = require('i18n');

function shelterUpdatingValidation(req, res, next) {
    return [
        body('newShelterName')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterNameError'))
            .isLength({ min: 5, max: 100 })
            .withMessage(i18n.__('newShelterNameLengthError')),
        body('newShelterCountry')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterCountryError')),
        body('newShelterCity')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterCityError')),
        body('newShelterStreet')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterStreetError')),
        body('newShelterHouse')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterHouseError')),
        body('newShelterDomain')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('newShelterDomainError'))
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage(i18n.__('newShelterDomainFormatError')),
    ];
}

module.exports = shelterUpdatingValidation;
