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
    workOfferController.create
);
router.put(
    '/:id',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    workOfferValidation,
    workOfferController.update
);
router.delete(
    '/:id',
    checkRoleMiddleware(['workerAdmin', 'subscriber']),
    hasUserShelterMiddleware,
    workOfferController.delete
);
router.get('/', workOfferController.getAll);
router.get('/:id', workOfferController.getOne);

module.exports = router;