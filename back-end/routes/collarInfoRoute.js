const Router = require('express');
const router = new Router();
const collarInfoController = require('../controllers/collarInfoController');

router.post('/collar/:collarId', collarInfoController.createCollarInfo);
router.get('/collar/:collarId', collarInfoController.getCollarInfoForOneCollar);
router.delete('/collar/:collarId', collarInfoController.clearCollarInfoForOneCollar);
router.delete('/:collarInfoId', collarInfoController.deleteCollarInfoById);


module.exports = router;