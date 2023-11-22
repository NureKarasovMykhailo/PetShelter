const Router = require('express');
const router = new Router();
const feederInfoController = require('../controllers/feederInfoController');

router.post('/feeder/:feederId', feederInfoController.createFeederInfo);
router.get('/feeder/:feederId', feederInfoController.getAllInfoForOneFeeder);
router.delete('/feeder/:feederId', feederInfoController.clearFeederInfoForOneFeeder);
router.delete('/:feederInfoId', feederInfoController.clearOneFeederInfo);


module.exports = router;