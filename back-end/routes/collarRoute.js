const Router = require('express');
const router = new Router();
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const collarController = require('../controllers/collarController');
const collarValidator = require('../middleware/validators/collarValidator');

router.post(
    '/',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarValidator,
    collarController.createCollar
);

router.put(
    '/:collarId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarController.updateCollar
);

router.delete(
    '/:collarId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarController.deleteCollar
);

router.get(
    '/',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarController.getAllCollars
);

router.patch(
    '/set/:collarId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarController.setCollarToPet
);

router.patch(
    '/unpin/:collarId',
    checkUserRoleMiddleware(['subscriber', 'petAdmin']),
    hasUserShelterMiddleware,
    collarController.unpinCollar
);


module.exports = router;