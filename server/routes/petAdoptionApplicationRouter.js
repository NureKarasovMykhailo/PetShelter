const Router = require('express');
const router = new Router();
const petAdoptionApplicationController = require('../controllers/petAdoptionApplicationController');
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');
const checkAuthorizationMiddleware = require('../middleware/checkAuthMiddleware');
const petAdoptionApplicationValidator = require('../middleware/validators/petAdoptionApplicationValidator');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');

router.post(
    '/:adoptionOfferId',
    checkAuthorizationMiddleware,
    petAdoptionApplicationValidator,
    petAdoptionApplicationController.create
);

router.delete(
    '/:id',
    checkAuthorizationMiddleware,
    petAdoptionApplicationController.delete
);


router.get(
    '/:id',
    checkAuthorizationMiddleware,
    petAdoptionApplicationController.getOne
);

router.get(
    '/adoptionOffer/:adoptionOfferId',
    checkUserRoleMiddleware(['subscriber', 'adoptionAdmin']),
    hasUserShelterMiddleware,
    petAdoptionApplicationController.getAllForOneOffer
);

module.exports = router;