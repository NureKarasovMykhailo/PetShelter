const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const subscriberRegistrationValidation = require('../middleware/validators/subscriberRegistrationValidator');

router.post('/user-registration', subscriberRegistrationValidation, userController.userRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', userController.check);

module.exports = router;