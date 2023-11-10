const ApiError = require('../error/ApiError');
const {Feeder, Pet} = require('../models/models');
const {validationResult} = require('express-validator');
const wasi = require("wasi");

const checkFeeder = (feeder, id, shelterId) => {
    if (!feeder){
        return ApiError.badRequest(`There are no feeder with ID: ${id}`)
    }
    if (feeder.shelterId !== shelterId){
        return ApiError.forbidden('You don\'t have an access to information about this shelter');
    }
}

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
        const feeders = await Feeder.findAll({where: {shelterId: req.user.shelterId}});
        return res.json({message: feeders});
    }
}

module.exports = new FeederController();