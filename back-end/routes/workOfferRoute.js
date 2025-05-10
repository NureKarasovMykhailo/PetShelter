const Router = require('express');
const router = new Router();
const workOfferController = require('../controllers/workOfferController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const workOfferValidation = require('../middleware/validators/workOfferValidation');

router.post(
    '/',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    workOfferValidation,
    workOfferController.createWorkOffer
);
router.put(
    '/:workOfferId',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    workOfferValidation,
    workOfferController.updateWorkOffer
);
router.delete(
    '/:workOfferId',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    workOfferController.deleteWorkOffer
);
router.get(
    '/',
    workOfferController.getAllWorkOffers
);
router.get(
    '/:workOfferId',
    workOfferController.getOneWorkOffer
);


module.exports = router;