const { body } = require('express-validator');

function shelterUpdatingValidation(req, res, next) {
    return [
        body('newShelterName')
            .trim()
            .notEmpty()
            .withMessage('newShelterNameError')
            .isLength({ min: 5, max: 100 })
            .withMessage('newShelterNameLengthError'),
        body('newShelterCountry')
            .trim()
            .notEmpty()
            .withMessage('newShelterCountryError'),
        body('newShelterCity')
            .trim()
            .notEmpty()
            .withMessage('newShelterCityError'),
        body('newShelterStreet')
            .trim()
            .notEmpty()
            .withMessage('newShelterStreetError'),
        body('newShelterHouse')
            .trim()
            .notEmpty()
            .withMessage('newShelterHouseError'),
        body('newShelterDomain')
            .trim()
            .notEmpty()
            .withMessage('newShelterDomainError')
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage('newShelterDomainFormatError'),
    ];
}

module.exports = shelterUpdatingValidation();
