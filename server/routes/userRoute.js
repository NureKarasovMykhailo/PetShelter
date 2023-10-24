const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const subscriberRegistrationValidation = require('../middleware/validators/subscriberRegistrationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');

router.post('/registration', subscriberRegistrationValidation, userController.userRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', checkAuthMiddleware, userController.check);

module.exports = router;