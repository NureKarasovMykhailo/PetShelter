const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const userRegistrationValidation = require('../middleware/validators/userRegistrationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const isUserNotEmployeeMiddleware = require('../middleware/isUserNotEmployeeMiddleware');
const checkUserRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/registration', userRegistrationValidation, userController.userRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', checkAuthMiddleware, userController.check);
router.post('/subscribe', checkAuthMiddleware, isUserNotEmployeeMiddleware, userController.subscribe);
router.post('/change/password/code', userController.sendConfirmationCode);
router.post('/change/password/code/check', userController.checkConfirmationCode);
router.post('/change/password/code/changing', userController.changePassword);
router.post('/change/email', checkAuthMiddleware, userController.changeEmail);
router.post('/change/telephone', checkAuthMiddleware, userController.changePhoneNumber);
router.post('/change/image', checkAuthMiddleware, userController.changeUserImage);

router.get('/profile', checkAuthMiddleware, userController.getProfileInfoByToken);
router.get('/', checkUserRoleMiddleware(['systemAdmin']), userController.getUsers);
router.get('/profile/:userId', checkUserRoleMiddleware(['systemAdmin']), userController.getProfileInfoByUserId);
router.delete('/:userId', checkUserRoleMiddleware(['systemAdmin']), userController.deleteUser);
router.delete('/', checkAuthMiddleware, userController.deleteUserByToken);



module.exports = router;