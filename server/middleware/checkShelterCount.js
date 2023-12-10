const ApiError = require('../error/ApiError');
const {Shelter} = require('../models/models');
const i18n = require('i18n');

module.exports = async function (req, res, next) {
    console.log('Starting checking shelter count');
    console.log(req.user.id);
    const shelter = await Shelter.findOne({where: {userId: req.user.id}});
    if (shelter) {
        next(ApiError.badRequest(i18n.__('youHaveShelter')))
    }
    next();
};