const {body} = require('express-validator');

function collarCreatingValidator(req, res, next) {
    return [
        body('maxTemperature')
            .trim()
            .notEmpty()
            .withMessage('Please enter max allow temperature')
            .isDecimal()
            .withMessage('Please enter max allow temperature'),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage('Please enter min allow temperature')
            .isDecimal()
            .withMessage('Please enter min allow temperature'),
        body('maxPulse')
            .trim()
            .notEmpty()
            .withMessage('Please enter max allow pulse')
            .isDecimal()
            .withMessage('Please enter max allow pulse'),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage('Please enter min allow temperature')
            .isDecimal()
            .withMessage('Please enter min allow temperature'),
    ]
}

module.exports = collarCreatingValidator();