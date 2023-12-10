const { body } = require('express-validator');
const i18n = require("i18n");

function collarCreatingValidator() {
    return [
        body('maxTemperature')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('collarMaxTempIsNotDefined'))
            .isDecimal()
            .withMessage(i18n.__('collarMaxTempIsNotDecimal')),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('collarMinTempIsNotDefined'))
            .isDecimal()
            .withMessage(i18n.__('collarMinTempIsNotDecimal')),
        body('maxPulse')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('collarMaxPulseIsNotDefined'))
            .isDecimal()
            .withMessage(i18n.__('collarMaxPulseIsNotDecimal')),
        body('minTemperature')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('collarMinTempIsNotDefined'))
            .isDecimal()
            .withMessage(i18n.__('collarMinTempIsNotDecimal')),
    ];
}

module.exports = collarCreatingValidator;
