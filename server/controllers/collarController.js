const {Collar, Pet} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const collarService = require('../services/CollarService');
const collarInfOService = require('../services/CollarInfoService');
const feederService = require("../services/FeederService");
const pagination = require("../classes/Pagination");
const i18n = require("i18n");

class CollarController {

    async createCollar(req, res, next){
        try {
            const {
                maxTemperature,
                minTemperature,
                minPulse,
                maxPulse
            } = req.body;

            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                errorArray.forEach(error => {
                    error.msg = i18n.__(error.msg);
                });
                return next(ApiError.badRequest(errorArray));
            }

            const createdCollar = await collarService.createCollar({
                maxPulse,
                minPulse,
                maxTemperature,
                minTemperature,
                shelterId: req.user.shelterId
            });
            return res.status(200).json(createdCollar);

        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + "" + error));
        }
    }

    async updateCollar(req, res, next) {
        try {
            const {collarId} = req.params;
            const {
                newMinTemperature,
                newMaxTemperature,
                newMinPulse,
                newMaxPulse
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const targetCollar = await collarService.getCollarById(collarId);
            if (!targetCollar) {
                return next(ApiError.notFound(i18n.__("collarIsNotFound") + " " + collarId));
            }
            if (targetCollar.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }
            const updatedCollar = await collarService.updateCollar(targetCollar, {
                newMaxTemperature,
                newMinPulse,
                newMaxPulse,
                newMinTemperature
            });
            return res.status(200).json(updatedCollar);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + " " + error));
        }
    }

    async deleteCollar(req, res, next) {
        try {
            const {collarId} = req.params;
            const targetCollar = await collarService.getCollarById(collarId);
            if (!targetCollar){
                return next(ApiError.notFound( i18n.__("collarIsNotFound") + collarId));
            }
            if (targetCollar.shelterId !== req.user.shelterId){
                return next(ApiError.forbidden(i18n.__("youDontHaveAccessToThisInformation")));
            }
            await collarInfOService.deleteCollarInfoByCollarId(targetCollar.id);
            await targetCollar.destroy();
            return res.status(200).json({message: collarId + i18n.__("collarWasDeleted")});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + ' ' + error));
        }
    }

    async getAllCollars(req, res, next) {
        try {
            let {limit, page} = req.query;

            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;
            let collars = [];
            collars = await collarService.getAllCollars(req.user.shelterId);
            console.log(collars)
            const paginatedFeeders = pagination.paginateItems(collars, offset, limit);

            return res.json({
                collars: paginatedFeeders.paginatedItems,
                pagination: {
                    totalItems: paginatedFeeders.itemCount,
                    totalPages: paginatedFeeders.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async setCollarToPet(req, res, next) {
        try {
            const {collarId} = req.params;
            const {petId} = req.query;
            const targetCollar = await collarService.getCollarById(collarId);

            const error = await collarService.isCollarExistAndBelongToShelter(targetCollar, collarId, req.user.shelterId);
            if (error){
                return next(error);
            }

            const targetPet = await Pet.findOne({where: {id: petId}});

            if (!targetPet){
                return next(ApiError.badRequest( i18n.__('There are no pet with ID: ') + petId));
            }

            if (targetPet.shelterId !== req.user.shelterId){
                return next(ApiError.badRequest(i18n.__('youDontHaveAccessToThisInformation')));
            }
            console.log('start')
            if (await collarService.isCollarOccupied(collarId)){
                return next(ApiError.forbidden( i18n.__('collarIsOccupied') + collarId));
            }

            const updatedCollar = await collarService.setCollarToPet(collarId, petId);

            return res.status(200).json(updatedCollar);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async unpinCollar(req, res, next) {
        const {collarId} = req.params;
        const collar = await collarService.getCollarById(collarId);

        const error = await collarService.isCollarExistAndBelongToShelter(collar, collarId, req.user.shelterId);
        if (error){
            return next(error);
        }

        const pet = await Pet.findOne({where: {feederId: collarId}});
        if (pet){
            if (pet.shelterId !== req.user.shelterId){
                return next(ApiError.badRequest(i18n.__('youDontHaveAccessToThisInformation')));
            }
            pet.feederId = null;
            await pet.save();
        }
        collar.petId = null;
        collar.save();
        return res.status(200).json({feeder: collar});
    }

}

module.exports = new CollarController();