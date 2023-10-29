const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const subscriberRegistrationValidation = require('../middleware/validators/userRegistrationValidator');
const checkAuthMiddleware = require('../middleware/checkAuthMiddleware');
const employeeController = require('../controllers/employeeController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const hasUserShelterMiddleware = require('../middleware/hasUserShelterMiddleware');
const employeeCreatingValidator = require('../middleware/validators/employeeCreatingValidator');

router.post('/registration', subscriberRegistrationValidation, userController.userRegistration);
router.post('/authorization', userController.authorization);
router.get('/auth', checkAuthMiddleware, userController.check);

router.post(
    '/employee/registration',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeCreatingValidator,
    employeeController.create
);
router.get('/employee', checkAuthMiddleware, hasUserShelterMiddleware, employeeController.getAll);
router.get('/employee/:id', checkAuthMiddleware, hasUserShelterMiddleware, employeeController.getOne);
router.delete(
    '/employee/:id',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeController.delete
);

module.exports = router;