const { body } = require('express-validator');

function feederValidator(req, res, next) {
    return [
        body('capacity')
            .trim()
            .isDecimal()
            .withMessage('feederCapacityError'),
        body('designedFor')
            .trim()
            .notEmpty()
            .withMessage('feederDesignedForError'),
        body('feederColour')
            .trim()
            .notEmpty()
            .withMessage('feederColourError')
    ];
}

module.exports = feederValidator();
