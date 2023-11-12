const Router = require('express');
const router = new Router();
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const hasUserShelterMiddleware = require("../middleware/hasUserShelterMiddleware");
const employeeCreatingValidator = require("../middleware/validators/employeeCreatingValidator");
const employeeController = require("../controllers/employeeController");
const checkAuthMiddleware = require("../middleware/checkAuthMiddleware");
const ifSubscribeOfShelterOwnerIsValid = require('../middleware/ifSubscribeOfShelterOwnerIsValid');



router.post(
    '/',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    employeeCreatingValidator,
    employeeController.create
);
router.get('/', checkAuthMiddleware, ifSubscribeOfShelterOwnerIsValid, hasUserShelterMiddleware, employeeController.getAll);
router.get('/:id', checkAuthMiddleware, ifSubscribeOfShelterOwnerIsValid, hasUserShelterMiddleware, employeeController.getOne);
router.delete(
    '/:id',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    ifSubscribeOfShelterOwnerIsValid,
    employeeController.delete
);

module.exports = router;