const {ApplicationForAdoption, User} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const getUserRoles = require('../middleware/getUserRoles');
const petAdoptionOfferService = require('../services/PetAdoptionOfferService');
const applicationForAdoptionService = require('../services/ApplicationForAdoptionService');
const pagination = require('../classes/Pagination');
const nodemailer = require('../classes/Nodemailer');
const i18n = require('i18n');

class PetAdoptionApplicationController{
    async createApplicationForAdoption(req, res, next){
        try {
            const {adoptionOfferId} = req.params;
            const {applicationAddress} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const adoptionOffer = await petAdoptionOfferService.getPetAdoptionOfferById(adoptionOfferId);

            if (!adoptionOffer){
                return next(ApiError.badRequest(i18n.__('thereAreNoAdoptionOfferWithId') + adoptionOfferId));
            }

            const existedAdoptionApplication = await applicationForAdoptionService.findApplicationForAdoption(req.user.id, adoptionOfferId);

            if (existedAdoptionApplication){
                return next(ApiError.forbidden(i18n.__('youHaveAlreadyOnApplicationForAdoption')));
            }

            if (existedAdoptionApplication){
                return next(ApiError.forbidden(i18n.__('youAlreadyHaveApplicationOfAdoption')));
            }

            const applicationForAdoption = await applicationForAdoptionService.createApplicationForAdoption({
                applicationAddress,
                adoptionOfferId,
                userId: req.user.id
            });
            return res.status(200).json(applicationForAdoption);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async deleteApplicationForAdoption(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const adoptionApplication = await ApplicationForAdoption.findOne({where: {id: applicationForAdoptionId}});
            if (!adoptionApplication){
                return next(ApiError.badRequest(i18n.__('thereNoApplicationForAdoptionWithId') + applicationForAdoptionId));
            }
            if (adoptionApplication.userId === req.user.id){
                await adoptionApplication.destroy();
                return res.json({message: i18n.__('applicationForAdoptionWasDeleted') + applicationForAdoptionId});
            }
            const roles = await getUserRoles(req.user);

            const error = await applicationForAdoptionService.checkUserPermissionToApplicationForAdoption(
                roles,
                req.user,
                adoptionApplication
            );

            if (error){
                return next(error);
            }
            await adoptionApplication.destroy();
            return res.status(200).json({message: i18n.__('applicationForAdoptionWasDeleted') + applicationForAdoptionId});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getOne(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const adoptionApplication = await applicationForAdoptionService.findApplicationForAdoption(applicationForAdoptionId);

            if (!adoptionApplication){
                return next(ApiError.badRequest(i18n.__('thereIsNoApplicationForAdoptionWithId') + applicationForAdoptionId));
            }

            if (adoptionApplication.userId === req.user.id){
                return res.status(200).json(adoptionApplication);
            }

            const roles = await getUserRoles(req.user);
            const error = await applicationForAdoptionService.checkUserPermissionToApplicationForAdoption(
                roles,
                req.user,
                adoptionApplication
            );
            if (error){
                return next(error);
            }

            return res.status(200).json(adoptionApplication);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getAllForOneOffer(req, res, next){
        try {
            const {adoptionOfferId} = req.params;
            let {
                adopterName,
                page,
                limit,
                sortBy
            } = req.query;

            page = page || 1;
            limit = limit || 9;

            let offset = page * limit - limit;

            const adoptionOffer = await petAdoptionOfferService.getPetAdoptionOfferById(adoptionOfferId);

            if (!adoptionOffer){
                return next(ApiError.badRequest(i18n.__('thereAreNoAdoptionOfferWithId') + adoptionOfferId));
            }
            console.log(adoptionOffer);
            if (!await petAdoptionOfferService.isAdoptionOfferBelongToShelter(req.user.shelterId, adoptionOffer)){
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }
            let applicationForAdoption = [];
            if (adopterName){
                applicationForAdoption = await applicationForAdoptionService.filterApplicationsByName(adoptionOfferId, adopterName);
            } else {
                applicationForAdoption = await applicationForAdoptionService.getAllApplications(adoptionOfferId);
            }
            applicationForAdoptionService.sortApplications(applicationForAdoption, sortBy);

            const paginatedApplicationForAdoption = pagination.paginateItems(applicationForAdoption, offset, limit);

            return res.json({
                applicationForAdoption: paginatedApplicationForAdoption.paginatedItems,
                pagination: {
                    totalItems: paginatedApplicationForAdoption.itemCount,
                    totalPages: paginatedApplicationForAdoption.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async approvedApplication(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const applicationForAdoption = await applicationForAdoptionService.findApplicationForAdoption(applicationForAdoptionId);

            if (!applicationForAdoption){
                return next(ApiError.badRequest(i18n.__('thereNoApplicationForAdoptionWithId') + applicationForAdoptionId));
            }
            if (!await applicationForAdoptionService.isAdoptionApplicationBelongToShelter(req.user, applicationForAdoption)){
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            if (applicationForAdoption.is_application_approved){
                return next(ApiError.badRequest(i18n.__('applicationForAdoptionIsAlreadyApproved') + applicationForAdoptionId));
            }

            const adopter = await User.findOne({where: {id: applicationForAdoption.userId}});
            if (!adopter){
                return next(ApiError.badRequest(i18n.__('invalidUserId') + applicationForAdoption.userId));
            }

            applicationForAdoption.is_application_approved = true;
            await applicationForAdoption.save();
            await applicationForAdoptionService.destroyAllOtherApplicationForAdoption(applicationForAdoption);

            const shelterInfo = await applicationForAdoptionService.getShelterInfo(applicationForAdoption);
            const petInfo = await applicationForAdoptionService.getAdoptedPetInfo(applicationForAdoption);

            const mailSubject = i18n.__('applicationHeader');
            const mailText = i18n.__('dear') + adopter.full_name + '\n'
                + `\n`
                + i18n.__('applicationEmail') + '\n'
                + `\n`
                + i18n.__('applicationShelterInfo')
                + i18n.__('applicationShelterName') + shelterInfo.shelter_name
                + i18n.__('applicationAddress') + shelterInfo.shelter_address

                + i18n.__('applicationFriend') + '\n'
                + i18n.__('applicationName') + petInfo.pet_name + '\n'
                + i18n.__('applicationAge') + petInfo.pet_age + '\n'
                + i18n.__('applicationKind') + petInfo.pet_kind + '\n'
                + i18n.__('applicationGender') + petInfo.pet_gender + '\n'
                + `\n`
                + i18n.__('applicationMoment')
                + i18n.__('applicationContact')
                + `\n`
                + i18n.__('applicationRegards') + '\n'
                + i18n.__('applicationTeam') + shelterInfo.shelter_name;

            await nodemailer.sendEmail(adopter.email, mailSubject, mailText);

            return res.status(200).json(applicationForAdoption);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }

    }
}

module.exports = new PetAdoptionApplicationController();