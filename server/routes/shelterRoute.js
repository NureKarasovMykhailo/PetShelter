const Router = require('express');
const router = new Router();
const shelterController = require('../controllers/shelterController');
const checkUserRole = require('../middleware/checkRoleMiddleware');
const shelterValidator = require('../middleware/validators/shelterCreationValidator');
const checkShelterCount = require('../middleware/checkShelterCount');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const shelterUpdatingValidator = require('../middleware/validators/shelterUpdatingValidator');

router.post(
    '/',
    checkUserRole(['subscriber']),
    checkShelterCount,
    shelterValidator,
    shelterController.create
);
router.get('/:id', checkAuthMiddleware, shelterController.get);
router.put('/:id', checkUserRole(['subscriber']), shelterUpdatingValidator, shelterController.update);
router.delete('/:id', checkUserRole(['subscriber']), shelterController.delete);

module.exports = router;