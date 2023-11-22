const {body} = require('express-validator');
function shelterUpdatingValidation(req, res, next) {
    return [
        body('newShelterName')
            .trim()
            .notEmpty()
            .withMessage('Please enter name of your shelter')
            .isLength({min: 5, max: 100})
            .withMessage('Name of shelter must be from 5 to 100 symbols'),
        body('newShelterCountry')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter'),
        body('newShelterCity')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter'),
        body('newShelterStreet')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter'),
        body('newShelterHouse')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter'),
        body('newShelterDomain')
            .trim()
            .notEmpty()
            .withMessage('Please enter domain of your shelter')
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage('Your domain should be something like: @example.com'),
    ];
}

module.exports = shelterUpdatingValidation();