const Router = require('express');
const router = new Router();
const feederController = require('../controllers/feederController');
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const feederValidator = require('../middleware/validators/feederValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');

router.post(
    '/',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederValidator,
    feederController.createFeeder
);

router.put(
    '/:feederId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.updateFeeder
);

router.delete(
    '/:feederId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.deleteFeeder
);

router.get(
    '/',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    feederController.getAllFeeders
);

router.patch(
    '/set/:feederId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.setFeederToPet
);

router.patch(
    '/unpin/:feederId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.unpinFeederFromPet
);

module.exports = router;