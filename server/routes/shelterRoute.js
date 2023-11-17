const Router = require('express');
const router = new Router();
const shelterController = require('../controllers/shelterController');
const checkUserRole = require('../middleware/checkRoleMiddleware');
const shelterValidator = require('../middleware/validators/shelterCreationValidator');
const checkShelterCount = require('../middleware/checkShelterCount');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const shelterUpdatingValidator = require('../middleware/validators/shelterUpdatingValidator');
const checkSubscription = require('../middleware/checkSubsciptionMiddleware');
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');

router.post(
    '/',
    checkUserRole(['subscriber']),
    checkSubscription,
    checkShelterCount,
    shelterValidator,
    shelterController.create
);
router.get('/:id', checkAuthMiddleware, ifSubscribeOfShelterOwnerIsValid,  shelterController.get);
router.put('/:id', checkUserRole(['subscriber']), shelterUpdatingValidator, shelterController.update);
router.delete('/:id', checkUserRole(['subscriber']), shelterController.delete);

module.exports = router;