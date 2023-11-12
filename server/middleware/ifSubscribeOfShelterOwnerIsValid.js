const {User, Shelter} = require('../models/models');
const ApiError = require('../error/ApiError');
const isSubscriptionValid = require('../functions/isSubscriptionIsValid');

module.exports = async function (req, res, next){
    const auth = Buffer.from(process.env.CLIENT_ID + ':' + process.env.SECRET).toString('base64');
    const shelter = await Shelter.findOne({where: {id: req.user.shelterId}});
    if (!shelter){
        next(ApiError.badRequest('You don\'t have any shelter'));
    }
    const shelterOwner = await User.findOne({where: {id: shelter.userId}});

    if (await isSubscriptionValid(auth, shelterOwner)){
        next();
    } else {
        return next(ApiError.forbidden('Your shelter owner\'s subscription is not valid'));
    }

}