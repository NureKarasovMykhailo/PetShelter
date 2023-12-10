const { body } = require('express-validator');
const i18n = require('i18n');

function feederValidator(req, res, next) {
    return [
        body('capacity')
            .trim()
            .isDecimal()
            .withMessage(i18n.__('feederCapacityError')),
        body('designedFor')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('feederDesignedForError')),
        body('feederColour')
            .trim()
            .notEmpty()
            .withMessage(i18n.__('feederColourError'))
    ];
}

module.exports = feederValidator;
