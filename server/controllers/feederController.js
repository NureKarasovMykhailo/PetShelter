const ApiError = require('../error/ApiError');
const {Feeder, Pet} = require('../models/models');
const {validationResult} = require('express-validator');

const checkFeeder = (feeder, feederId, shelterId) => {
    if (!feeder){
        return ApiError.badRequest(`There are no feeder with ID: ${feederId}`)
    }
    if (feeder.shelterId !== shelterId){
        return ApiError.forbidden('You don\'t have an access to information about this shelter');
    }
}

const isFeederOccupied = async (feederId) => {
    const petWithCheckedFeeder = await Pet.findOne({where: {feederId}})
    if (petWithCheckedFeeder){
        return true;
    }
    return false;
}

const clearInformationAboutLastFeeder = async (petId) => {
  const lastFeeder = await Feeder.findOne({where: {petId}});
  if (lastFeeder){
      lastFeeder.petId = null;
      await lastFeeder.save();
  }
};

class FeederController {

    async create(req, res, next){
        const {capacity, designedFor, feederColour} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }

        const feeder = await Feeder.create(
            {
                capacity: capacity,
                designed_for: designedFor,
                feeder_colour: feederColour,
                shelterId: req.user.shelterId
            }
        );
        return res.json({message: feeder});
    }

    async update(req, res, next){
        const {capacity, designedFor, feederColour} = req.body;
        const {id} = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }
        const feeder = await Feeder.findOne({where: {id}});
        const error = checkFeeder(feeder, id, req.user.shelterId);
        if (error){
            return next(error);
        }

        feeder.feeder_colour = feederColour;
        feeder.capacity = capacity;
        feeder.designed_for = designedFor;
        await feeder.save();
        return res.json({message: feeder});
    }

    async delete(req, res, next){
        const {id} = req.params;
        const feeder = await Feeder.findOne({where: {id}});

        const error = checkFeeder(feeder, id, req.user.shelterId);
        if (error){
            return next(error);
        }

        await feeder.destroy();
        return res.json({message: `Feeder with ID: ${id} was deleted`});
    }

    async get(req, res, next){
        let {designedFor, petName, isEmpty, limit, page} = req.query;

        limit = limit || 9;
        page = page || 1;
        let offset = page * limit - limit;
        let feeders;

        if (designedFor && isEmpty){
            feeders = await Feeder.findAll({
                where: {designed_for: designedFor, petId: null},
                include: [{
                    model: Pet,
                    attributes: ['id', 'pet_name'],
                }]
            })
        }
        if (designedFor && !isEmpty){
            feeders = await Feeder.findAll({
                where: {designed_for: designedFor},
                include: [{
                    model: Pet,
                    attributes: ['id', 'pet_name'],
                }]
            });
        }
        if (!designedFor && isEmpty){
            feeders = await Feeder.findAll({
                where: { petId: null},
                include: [{
                    model: Pet,
                    attributes: ['id', 'pet_name'],
                }]
            })
        }
        if (!designedFor && !isEmpty){
            feeders = await Feeder.findAll({
                include: [{
                    model: Pet,
                    attributes: ['id', 'pet_name'],
                }]
            })
        }

        if (petName) {
            feeders = feeders.filter(feeder =>
                feeder.pet !== null && feeder.pet.pet_name === petName
            );
        }


        let feederCount = feeders.length;
        let totalPages = Math.ceil(feederCount / limit);
        let paginatedFeeders = feeders.slice(offset, offset + limit);

        return res.json({
            feeders: paginatedFeeders,
            pagination: {
                totalItems: feederCount,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });

    }

    async setPet(req, res, next){
        const feederId = req.params.id;
        const {petId} = req.query;

        const feeder = await Feeder.findOne({where: {id: feederId}});
        const error = checkFeeder(feeder, feederId, req.user.shelterId);
        if (error){
            return next(error);
        }
        const pet = await Pet.findOne({where: {id: petId}});
        if (!pet){
            return next(ApiError.badRequest(`There are no pet with ID: ${petId}`));
        }
        if (pet.shelterId !== req.user.shelterId){
            return next(ApiError.badRequest('You don\'t have an access to information about this shelter'));
        }

        if (await isFeederOccupied(feederId)){
            return next(ApiError.forbidden(`Feeder with ID: ${feederId} is already occupied`));
        }

        feeder.petId = pet.id;
        pet.feederId = feeder.id;

        await clearInformationAboutLastFeeder(pet.id);
        await feeder.save();
        await pet.save();

        return res.status(200).json({feeder: feeder});
    }

    async unpinFeederFromPet(req, res, next){
        const {id} = req.params;

        const feeder = await Feeder.findOne({where: {id}});

        const error = await checkFeeder(feeder, id, req.user.shelterId);
        if (error){
            return next(error);
        }

        const pet = await Pet.findOne({where: {feederId: id}});
        if (pet){
            if (pet.shelterId !== req.user.shelterId){
                return next(ApiError.badRequest('You don\'t have an access to information about this shelter'));
            }
            pet.feederId = null;
            await pet.save();
        }
        feeder.petId = null;
        feeder.save();
        return res.status(200).json({feeder: feeder});
    }
}

module.exports = new FeederController();