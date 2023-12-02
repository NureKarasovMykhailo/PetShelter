const Router = require('express');
const router = new Router();
const userRouter = require('./userRoute');
const shelterRouter = require('./shelterRoute');
const petRouter = require('./petRoute');
const workOfferRouter = require('./workOfferRoute');
const petAdoptionOfferRouter = require('./petAdoptionOfferRoute');
const petAdoptionApplicationRouter = require('./petAdoptionApplicationRouter');
const feederRouter = require('./feederRoute');
const employeeRouter = require('./employeeRoute');
const feederInfoRouter = require('./feederInfoRoute');
const collarRouter = require('./collarRoute');
const collarInfoRouter = require('./collarInfoRoute');

router.use('/user', userRouter);
router.use('/shelter', shelterRouter);
router.use('/pet', petRouter);
router.use('/work-offer', workOfferRouter);
router.use('/pet-adoption-offer', petAdoptionOfferRouter);
router.use('/pet-adoption-application', petAdoptionApplicationRouter);
router.use('/feeder', feederRouter);
router.use('/employee', employeeRouter);
router.use('/feeder-info', feederInfoRouter);
router.use('/collar', collarRouter);
router.use('/collar-info', collarInfoRouter);


module.exports = router;