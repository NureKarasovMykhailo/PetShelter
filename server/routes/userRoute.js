const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const subscriberRegistrationValidation = require('../middleware/validators/subscriberRegistrationValidator');

router.post('/subscriber-registration', subscriberRegistrationValidation, userController.subscriberRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', userController.check);

module.exports = router;