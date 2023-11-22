const Router = require('express');
const router = new Router();
const petAdoptionApplicationController = require('../controllers/petAdoptionApplicationController');
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');
const checkAuthorizationMiddleware = require('../middleware/checkAuthMiddleware');
const petAdoptionApplicationValidator = require('../middleware/validators/petAdoptionApplicationValidator');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post(
    '/:adoptionOfferId',
    checkAuthorizationMiddleware,
    petAdoptionApplicationValidator,
    petAdoptionApplicationController.createApplicationForAdoption
);

router.delete(
    '/:applicationForAdoptionId',
    checkAuthorizationMiddleware,
    petAdoptionApplicationController.deleteApplicationForAdoption
);


router.get(
    '/:applicationForAdoptionId',
    checkAuthorizationMiddleware,
    petAdoptionApplicationController.getOne
);

router.get(
    '/adoptionOffer/:adoptionOfferId',
    checkUserRoleMiddleware(['subscriber', 'adoptionAdmin']),
    hasUserShelterMiddleware,
    petAdoptionApplicationController.getAllForOneOffer
);

router.patch(
    '/approved/:applicationForAdoptionId',
    checkRoleMiddleware(['subscriber', 'adoptionAdmin']),
    hasUserShelterMiddleware,
    petAdoptionApplicationController.approvedApplication
);

module.exports = router;