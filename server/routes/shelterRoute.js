const Router = require('express');
const router = new Router();
const shelterController = require('../controllers/shelterController');
const checkUserRole = require('../middleware/checkRoleMiddleware');
const shelterValidator = require('../middleware/validators/shelterCreationValidator');
const checkShelterCount = require('../middleware/checkShelterCount');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const shelterUpdatingValidator = require('../middleware/validators/shelterUpdatingValidator');
const checkSubscription = require('../middleware/checkSubsciptionMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');

router.post(
    '/',
    checkUserRole(['subscriber']),
    checkSubscription,
    checkShelterCount,
    shelterValidator,
    shelterController.createShelter
);

router.get(
    '/one/:shelterId',
    checkAuthMiddleware,
    shelterController.getShelterById
);

router.put(
    '/:shelterId',
    checkUserRole(['subscriber']),
    shelterUpdatingValidator,
    shelterController.updateShelter
);

router.delete(
    '/',
    checkUserRole(['subscriber']),
    hasUserShelterMiddleware,
    shelterController.deleteShelterByToken
);

router.delete(
    '/:shelterId',
    checkUserRole(['systemAdmin']),
    shelterController.deleteShelterById
);

router.get(
    '/all',
    checkUserRole(['systemAdmin']),
    shelterController.getAllShelters
);

module.exports = router;