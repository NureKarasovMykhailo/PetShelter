const Router = require('express');
const router = new Router();
const userRouter = require('./userRoute');
const shelterRouter = require('./shelterRoute');

router.use('/user', userRouter);
router.use('/shelter', shelterRouter);

module.exports = router;