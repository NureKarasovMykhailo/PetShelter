const {body} = require('express-validator');

function petCreationValidator(req, res, next) {
    return [
      body('petName')
          .trim()
          .notEmpty()
          .withMessage('Please enter the name of pet'),
        body('petAge')
            .trim()
            .isInt()
            .withMessage('Please enter the age of pet'),
        body('petGender')
            .trim()
            .notEmpty()
            .withMessage('Please enter gender of the pet')
            .custom((value) => {
            if (value !== 'male' && value !== 'female') {
                throw new Error('Gender must be "male" or "female"');
            }
            return true;
            }),
        body('cellNumber')
            .trim()
            .notEmpty()
            .withMessage('Please enter pet\'s cell number')
    ];
}

module.exports = petCreationValidator();