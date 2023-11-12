const Router = require('express');
const router = new Router();
const petController = require('../controllers/petController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const petCreationValidation = require('../middleware/validators/petCreationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');

router.post(
    '/',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petCreationValidation,
    petController.create
);
router.get('/', checkAuthMiddleware,  hasUserShelterMiddleware, ifSubscribeOfShelterOwnerIsValid, petController.get);
router.get('/:id', checkAuthMiddleware, hasUserShelterMiddleware, ifSubscribeOfShelterOwnerIsValid, petController.getOne);
router.put(
    '/:id',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petCreationValidation,
    petController.update
);
router.delete(
    '/:id',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petController.delete
);

module.exports = router;