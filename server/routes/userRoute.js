const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const subscriberRegistrationValidation = require('../middleware/validators/userRegistrationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const isUserNotEmployeeMiddleware = require('../middleware/isUserNotEmployeeMiddleware');

router.post('/registration', subscriberRegistrationValidation, userController.userRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', checkAuthMiddleware, userController.check);
router.post('/subscribe', checkAuthMiddleware, isUserNotEmployeeMiddleware, userController.subscribe);
router.post('/change/password/code', userController.sendConfirmationCode);
router.post('/change/password/code/check', userController.checkConfirmationCode);
router.post('/change/password/code/changing', userController.changePassword);
router.post('/change/email', checkAuthMiddleware, userController.changeEmail);
router.post('/change/telephone', checkAuthMiddleware, userController.changePhoneNumber);
router.post('/change/image', checkAuthMiddleware, userController.changeUserImage);



module.exports = router;