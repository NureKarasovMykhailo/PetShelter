const Router = require('express');
const router = new Router();
const feederController = require('../controllers/feederController');
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const feederValidator = require('../middleware/validators/feederValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');

router.post(
    '/',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederValidator,
    feederController.create
);

router.put(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederController.update
);

router.delete(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederController.delete
);

router.get(
    '/',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederController.get
);

router.post(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederController.setPet
);

router.patch(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    feederController.unpinFeederFromPet
);

module.exports = router;