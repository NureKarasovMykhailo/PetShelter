const Router = require('express');
const router = new Router();
const workOfferController = require('../controllers/workOfferController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const workOfferValidation = require('../middleware/validators/workOfferValidation');
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');

router.post(
    '/',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    workOfferValidation,
    workOfferController.create
);
router.put(
    '/:id',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    workOfferValidation,
    workOfferController.update
);
router.delete(
    '/:id',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    workOfferController.delete
);
router.get('/', workOfferController.getAll);
router.get('/:id', ifSubscribeOfShelterOwnerIsValid, workOfferController.getOne);

module.exports = router;