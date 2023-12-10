const ApiError = require('../error/ApiError');
const {Feeder, Pet} = require('../models/models');
const {validationResult} = require('express-validator');
const feederService = require('../services/FeederService');
const pagination = require('../classes/Pagination');
const i18n = require('i18n');

const isFeederExistAndBelongToShelter = (feeder, feederId, shelterId) => {
    if (!feeder){
        return ApiError.badRequest( i18n.__('thereNoFeederWithId') + feederId)
    }
    if (feeder.shelterId !== shelterId){
        return ApiError.forbidden( i18n.__('youDontHaveAccessToThisInformation') );
    }
}

class FeederController {

    async createFeeder(req, res, next){
        try {
            const {capacity, designedFor, feederColour} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const feeder = await feederService.createFeeder({
                capacity,
                designedFor,
                feederColour,
                shelterId: req.user.shelterId
            });
            return res.status(200).json(feeder);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal( i18n.__('serverErrorText') + error));
        }
    }

    async updateFeeder(req, res, next){
        try {
            const {capacity, designedFor, feederColour} = req.body;
            const {feederId} = req.params;

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const targetFeeder = await feederService.getFeederById(feederId);

            const error = isFeederExistAndBelongToShelter(targetFeeder, feederId, req.user.shelterId);
            if (error){
                return next(error);
            }

            const updatedFeeder = await feederService.updateFeederData(targetFeeder, {
                capacity,
                designedFor,
                feederColour
            });

            return res.status(200).json(updatedFeeder);
        } catch (error){
            console.log(error);
            return next(ApiError.internal( i18n.__('serverErrorText') + error));
        }
    }

    async deleteFeeder(req, res, next){
        try {
            const {feederId} = req.params;
            const feeder = await Feeder.findOne({where: {id: feederId}});

            const error = isFeederExistAndBelongToShelter(feeder, feederId, req.user.shelterId);
            if (error){
                return next(error);
            }

            await feeder.destroy();
            return res.status(200).json({message: i18n.__('feederWasDeleted') + feederId});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getAllFeeders(req, res, next){
        try {
            let {designedFor, isEmpty, limit, page} = req.query;

            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;
            let feeders;

            feeders = await feederService.getFilteredFeeders({
                designedFor,
                isEmpty,
                shelterId: req.user.shelterId
            });

            const paginatedFeeders = pagination.paginateItems(feeders, offset, limit);

            return res.json({
                feeders: paginatedFeeders.paginatedItems,
                pagination: {
                    totalItems: paginatedFeeders.itemCount,
                    totalPages: paginatedFeeders.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal( i18n.__('serverErrorText') + error));
        }

    }

    async setFeederToPet(req, res, next){
        try {
            const {feederId} = req.params;
            const {petId} = req.query;

            const feeder = await feederService.getFeederById(feederId);

            const error = isFeederExistAndBelongToShelter(feeder, feederId, req.user.shelterId);
            if (error){
                return next(error);
            }

            const targetPet = await Pet.findOne({where: {id: petId}});

            if (!targetPet){
                return next(ApiError.badRequest( i18n.__('petIsNotFound') + petId));
            }

            if (targetPet.shelterId !== req.user.shelterId){
                return next(ApiError.badRequest(i18n.__('youDontHaveAccessToThisInformation')));
            }

            if (await feederService.isFeederOccupied(feederId)){
                return next(ApiError.forbidden(feederId + i18n.__('feederWithThisIdIsOccupied')));
            }

            const updatedFeeder = await feederService.setFeederToPet(feederId, petId);

            return res.status(200).json(updatedFeeder);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async unpinFeederFromPet(req, res, next){
        const {feederId} = req.params;
        const feeder = await feederService.getFeederById(feederId);

        const error = await isFeederExistAndBelongToShelter(feeder, feederId, req.user.shelterId);
        if (error){
            return next(error);
        }

        const pet = await Pet.findOne({where: {feederId: feederId}});
        if (pet){
            if (pet.shelterId !== req.user.shelterId){
                return next(ApiError.badRequest(i18n.__('youDontHaveAccessToThisInformation')));
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