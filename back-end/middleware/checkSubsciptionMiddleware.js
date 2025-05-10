const ApiError = require('../error/ApiError');
const {User} = require('../models/models');
const subscription = require('../classes/Subscription');
const i18n = require('i18n');

module.exports = async function (req, res, next) {
    const user = await User.findOne({where: {id: req.user.id}});
    if (!user.subscriptionId){
        return next(ApiError.forbidden(i18n.__('subscriptionError')));
    }
   if (await subscription.isSubscriptionIsValid(user)) {
       next();
   } else {
       return next(ApiError.forbidden(i18n.__('subscriptionError')));
   }
};