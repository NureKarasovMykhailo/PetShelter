const Router = require('express');
const router = new Router();
const shelterController = require('../controllers/shelterController');
const checkUserRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkUserRole('subscriber'), shelterController.create);
router.get('/:id', shelterController.get);
router.patch('/:id', shelterController.update);
router.delete('/:id', shelterController.delete);

module.exports = router;