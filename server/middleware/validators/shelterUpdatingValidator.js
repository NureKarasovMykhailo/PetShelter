const {body} = require('express-validator');
function shelterUpdatingValidation(req, res, next) {
    return [
        body('shelterName')
            .trim()
            .notEmpty()
            .withMessage('Please enter name of your shelter')
            .isLength({min: 5, max: 100})
            .withMessage('Name of shelter must be from 5 to 100 symbols'),
        body('shelterCity')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter')
            .matches(/^[a-zA-Zа-яА-ЯіІїЇєЄёЁ\s-]+$/)
            .withMessage('Please enter correct address of your shelter'),
        body('shelterStreet')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter')
            .matches(/^[a-zA-Zа-яА-ЯіІїЇєЄёЁ\s-]+$/)
            .withMessage('Please enter correct address of your shelter'),
        body('shelterHouse')
            .trim()
            .notEmpty()
            .withMessage('Please enter the address of your shelter')
            .matches(/^[\dA-Za-z\s/-]+$/)
            .withMessage('Please enter correct address of your shelter'),
        body('shelterDomain')
            .trim()
            .notEmpty()
            .withMessage('Please enter domain of your shelter')
            .matches(/^@[a-zA-Z0-9.-]+\.[a-z]+$/)
            .withMessage('Your domain should be something like: @example.com'),
    ];
}

module.exports = shelterUpdatingValidation();