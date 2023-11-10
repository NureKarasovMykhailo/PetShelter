const Router = require('express');
const router = new Router();
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");
const hasUserShelterMiddleware = require("../middleware/hasUserShelterMiddleware");
const employeeCreatingValidator = require("../middleware/validators/employeeCreatingValidator");
const employeeController = require("../controllers/employeeController");
const checkAuthMiddleware = require("../middleware/checkAuthMiddleware");


router.post(
    '/',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeCreatingValidator,
    employeeController.create
);
router.get('/', checkAuthMiddleware, hasUserShelterMiddleware, employeeController.getAll);
router.get('/:id', checkAuthMiddleware, hasUserShelterMiddleware, employeeController.getOne);
router.delete(
    '/:id',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeController.delete
);

module.exports = router;