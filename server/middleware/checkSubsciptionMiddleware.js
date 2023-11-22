const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const subscription = require('../classes/Subscription');

module.exports = async function (req, res, next) {
    const user = await User.findOne({where: {id: req.user.id}});
    if (!user.subscriptionId){
        return next(ApiError.forbidden('You must subscribe to use this functionality'));
    }
   if (await subscription.isSubscriptionIsValid(user)) {
       next();
   } else {
       return next(ApiError.forbidden('Your subscription is not valid'));
   }
};