const Router = require('express');
const router = new Router();
const petController = require('../controllers/petController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const petCreationValidation = require('../middleware/validators/petCreationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');

router.post(
    '/',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    petCreationValidation,
    petController.createPet
);
router.get(
    '/',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    petController.getAllPets
);
router.get(
    '/:petId',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    petController.getOnePetWithCharacteristics
);
router.put(
    '/:petId',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    petCreationValidation,
    petController.updatePet
);
router.delete(
    '/:petId',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    //ifSubscribeOfShelterOwnerIsValid,
    petController.deletePet
);

module.exports = router;