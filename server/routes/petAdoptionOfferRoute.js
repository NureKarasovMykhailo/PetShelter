const Router = require('express');
const router = new Router();
const petAdoptionOfferController = require('../controllers/petAdoptionOfferController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const petAdoptionValidator = require('../middleware/validators/petAdoptionValidator');
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');

router.post(
    '/:petId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petAdoptionValidator,
    petAdoptionOfferController.create
);

router.put(
    '/:offerId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petAdoptionValidator,
    petAdoptionOfferController.update
);
router.delete(
    '/:offerId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    petAdoptionOfferController.delete
);
router.get('/:offerId', petAdoptionOfferController.getOne);
router.get('/', petAdoptionOfferController.getAll);

module.exports = router;