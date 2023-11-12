const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const isSubscriptionValid = require('../functions/isSubscriptionIsValid');

module.exports = async function (req, res, next) {
    const auth = Buffer.from(process.env.CLIENT_ID + ':' + process.env.SECRET).toString('base64');
    const user = await User.findOne({where: {id: req.user.id}});
    if (!user.subscriptionId){
        return next(ApiError.forbidden('You must subscribe to use this functionality'));
    }
   if (await isSubscriptionValid(auth, user)) {
       next();
   } else {
       return next(ApiError.forbidden('Your subscription is not valid'));
   }
};