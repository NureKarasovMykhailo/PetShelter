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

// TODO написать обновление токена, сделать обновление токена после создание, обновление, удаления приюта
router.use('/user', userRouter);
router.use('/shelter', shelterRouter);
router.use('/pet', petRouter);
router.use('/work-offer', workOfferRouter);
router.use('/pet-adoption-offer', petAdoptionOfferRouter);
router.use('/pet-adoption-application', petAdoptionApplicationRouter);
router.use('/feeder', feederRouter);
router.use('/employee', employeeRouter);

module.exports = router;