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
    employeeController.createEmployee
);
router.patch(
    '/roles/add/:employeeId',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeController.addRoles
);
router.patch(
    '/roles/delete/:employeeId',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeController.deleteRoles
);

router.get(
    '/',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    employeeController.getAllEmployees
);

router.get(
    '/:employeeId',
    checkAuthMiddleware,
    hasUserShelterMiddleware,
    employeeController.getOneEmployee
);

router.delete(
    '/:employeeId',
    checkRoleMiddleware(['subscriber', 'workerAdmin']),
    hasUserShelterMiddleware,
    employeeController.deleteEmployee
);

module.exports = router;