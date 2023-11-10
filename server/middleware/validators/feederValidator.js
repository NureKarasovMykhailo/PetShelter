const {body} = require('express-validator');

function feederValidator(req, res, next){
    return [
        body('capacity')
            .trim()
            .isDecimal()
            .withMessage('Please enter correct capacity of the feeder'),
        body('designedFor')
            .trim()
            .isString()
            .withMessage('Please enter the type of animal for which the feeder is intended'),
        body('feederColour')
            .trim()
            .isString()
            .withMessage('Please enter correct colour of your feeder')
    ];
}

module.exports = feederValidator();