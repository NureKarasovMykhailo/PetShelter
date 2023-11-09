const Router = require('express');
const router = new Router();
const userRouter = require('./userRoute');
const shelterRouter = require('./shelterRoute');
const petRouter = require('./petRoute');
const workOfferRouter = require('./workOfferRoute');
const petAdoptionOffer = require('./petAdoptionOfferRoute');

router.use('/user', userRouter);
router.use('/shelter', shelterRouter);
router.use('/pet', petRouter);
router.use('/work-offer', workOfferRouter);
router.use('/pet-adoption-offer', petAdoptionOffer);

module.exports = router;