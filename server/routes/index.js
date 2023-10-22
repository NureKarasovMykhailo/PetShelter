const Router = require('express');
const router = new Router();
const userRouter = require('./userRoute');

router.use('/user', userRouter);

module.exports = router;