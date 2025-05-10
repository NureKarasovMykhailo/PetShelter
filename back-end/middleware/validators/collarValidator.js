const { body } = require('express-validator');

function collarCreatingValidator() {
    return [
        body('maxTemperature')
            .trim()
            .notEmpty()
            .withMessage('collarMaxTempIsNotDefined')
            .isDecimal()
            .withMessage('collarMaxTempIsNotDecimal'),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage('collarMinTempIsNotDefined')
            .isDecimal()
            .withMessage('collarMinTempIsNotDecimal'),
        body('maxPulse')
            .trim()
            .notEmpty()
            .withMessage('collarMaxPulseIsNotDefined')
            .isDecimal()
            .withMessage('collarMaxPulseIsNotDecimal'),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage('collarMinTempIsNotDefined')
            .isDecimal()
            .withMessage('collarMinTempIsNotDecimal'),
    ];
}

module.exports = collarCreatingValidator();
