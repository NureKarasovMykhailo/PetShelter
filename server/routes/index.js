const Router = require('express');
const router = new Router();
const userRouter = require('./userRoute');
const shelterRouter = require('./shelterRoute');
const petRouter = require('./petRoute');

router.use('/user', userRouter);
router.use('/shelter', shelterRouter);
router.use('/pet', petRouter);

module.exports = router;