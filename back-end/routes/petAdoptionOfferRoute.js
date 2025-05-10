const Router = require('express');
const router = new Router();
const petAdoptionOfferController = require('../controllers/petAdoptionOfferController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const petAdoptionValidator = require('../middleware/validators/petAdoptionValidator');

router.post(
    '/:petId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    petAdoptionValidator,
    petAdoptionOfferController.createPetAdoptionOffer
);

router.put(
    '/:offerId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    petAdoptionValidator,
    petAdoptionOfferController.update
);
router.delete(
    '/:offerId',
    checkRoleMiddleware(['adoptionAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    petAdoptionOfferController.deletePetAdoptionOffer
);
router.get('/:offerId', petAdoptionOfferController.getOneAdoptionOffer);
router.get('/', petAdoptionOfferController.getAllAdoptionOffers);

module.exports = router;