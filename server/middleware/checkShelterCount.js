const ApiError = require('../error/ApiError');
const {Shelter} = require('../models/models');

module.exports = async function (req, res, next) {
    console.log('Starting checking shelter count');
    console.log(req.user.id);
    const shelter = await Shelter.findOne({where: {userId: req.user.id}});
    if (shelter) {
        next(ApiError.badRequest('You already have registered shelter'))
    }
    next();
};