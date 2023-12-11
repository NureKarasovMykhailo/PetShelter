const { User} = require('../models/models');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const workOfferService = require('../services/WorkOfferService');
const pagination = require('../classes/Pagination');
const i18n = require('i18n');

class WorkOfferController {

    async createWorkOffer(req, res, next){
        try {
            const {
                workTitle,
                workDescription,
                workTelephone,
                workEmail
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                errorArray.forEach(error => {
                    error.msg = i18n.__(error.msg);
                });
                return next(ApiError.badRequest(errorArray));
            }

            const createdWorkOffer = await workOfferService.createWorkOffer({
                workTitle,
                workDescription,
                workTelephone,
                workEmail,
                shelterId: req.user.shelterId
            });

            return res.status(200).json(createdWorkOffer);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async updateWorkOffer(req, res, next){
        try {
            const {workOfferId} = req.params;

            if (workOfferId === null) {
                return next(ApiError.badRequest(i18n.__('invalidWorkOfferId')));
            }
            const {
                workTitle,
                workDescription,
                workTelephone,
                workEmail
            } = req.body;

            const workOffer = await workOfferService.getWorkOfferById(workOfferId);

            if (!workOffer) {
                return next(ApiError.badRequest(i18n.__('invalidWorkOfferId')));
            }

            const workOfferOwnerUser = await User.findOne({where: {id: req.user.id}});
            if (workOfferOwnerUser.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            const updatedWorkOffer = await workOfferService.updateWorkOffer(workOffer, {
                workTitle,
                workDescription,
                workTelephone,
                workEmail
            });

            return res.status(200).json(updatedWorkOffer);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async deleteWorkOffer(req, res, next){
        try {
            const {workOfferId} = req.params;
            const workOffer = await workOfferService.getWorkOfferById(workOfferId);

            if (!workOffer) {
                return next(ApiError.badRequest(i18n.__('invalidWorkOfferId')));
            }

            if (workOffer.shelterId !== req.user.shelterId){
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            await workOffer.destroy();
            return res.status(200).json({message: i18n.__('workOfferWasDelete') + workOfferId });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getOneWorkOffer(req, res, next){
        try {
            const {workOfferId} = req.params;
            const workOffer = await workOfferService.getWorkOfferById(workOfferId);
            if (!workOffer){
                return next(ApiError.badRequest(i18n.__('invalidWorkOfferId') + workOfferId ));
            }
            return res.status(200).json({message: workOffer});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getAllWorkOffers(req, res, next){
        try {
            let {city, country, title, limit, page, sortBy} = req.query;
            let workOffers = [];
            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;

            workOffers = await workOfferService.getWorkOfferByCityAndCountry(workOffers, city, country);

            if (title){
                workOffers = await workOfferService.filterWorkOffersByTitle(workOffers, title);
            }

            workOfferService.sortWorkOffers(workOffers, sortBy);

            const paginatedWorkOffers = pagination.paginateItems(workOffers, offset, limit);

            return res.status(200).json({
                workOffers: paginatedWorkOffers.paginatedItems,
                pagination: {
                    totalItems: paginatedWorkOffers.itemCount,
                    totalPages: paginatedWorkOffers.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }
}

module.exports = new WorkOfferController();