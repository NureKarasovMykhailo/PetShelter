const Router = require('express');
const router = new Router();
const petController = require('../controllers/petController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const perCreationValidation = require('../middleware/validators/petCreationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');

router.post(
    '/',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    perCreationValidation,
    petController.create
);
router.get('/', checkAuthMiddleware, hasUserShelterMiddleware, petController.get);
router.get('/:id', checkAuthMiddleware, hasUserShelterMiddleware, petController.getOne);
router.put(
    '/:id',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    perCreationValidation,
    petController.update
);
router.delete(
    '/:id',
    checkRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    petController.delete
);

module.exports = router;