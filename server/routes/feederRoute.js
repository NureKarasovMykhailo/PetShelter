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
    feederController.create
);

router.put(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.update
);

router.delete(
    '/:id',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    feederController.delete
);

router.get(
    '/',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    feederController.get
);

module.exports = router;