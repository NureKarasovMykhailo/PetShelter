const {ApplicationForAdoption, User} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const getUserRoles = require('../middleware/getUserRoles');
const petAdoptionOfferService = require('../services/PetAdoptionOfferService');
const applicationForAdoptionService = require('../services/ApplicationForAdoptionService');
const pagination = require('../classes/Pagination');
const nodemailer = require('../classes/Nodemailer');

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
                return next(ApiError.badRequest(`There are no adoption offer with ID: ${adoptionOfferId}`));
            }

            const existedAdoptionApplication = await applicationForAdoptionService.findApplicationForAdoption(req.user.id, adoptionOfferId);

            if (existedAdoptionApplication){
                return next(ApiError.forbidden('You have already one application for adoption'));
            }

            if (existedAdoptionApplication){
                return next(ApiError.forbidden('You already have application of adoption'));
            }

            const applicationForAdoption = await applicationForAdoptionService.createApplicationForAdoption({
                applicationAddress,
                adoptionOfferId,
                userId: req.user.id
            });
            return res.status(200).json(applicationForAdoption);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while creating application for adoption ' + error));
        }
    }

    async deleteApplicationForAdoption(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const adoptionApplication = await ApplicationForAdoption.findOne({where: {id: applicationForAdoptionId}});
            if (!adoptionApplication){
                return next(ApiError.badRequest(`There no application for adoption with ID: ${applicationForAdoptionId}`));
            }
            if (adoptionApplication.userId === req.user.id){
                await adoptionApplication.destroy();
                return res.json({message: `Application for adoption with ID: ${applicationForAdoptionId} was deleted`});
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
            return res.status(200).json({message: `Application for adoption with ID: ${applicationForAdoptionId} was deleted`});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while deleting application for adoption ' + error));
        }
    }

    async getOne(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const adoptionApplication = await applicationForAdoptionService.findApplicationForAdoption(applicationForAdoptionId);

            if (!adoptionApplication){
                return next(ApiError.badRequest(`There no application for adoption with ID: ${applicationForAdoptionId}`));
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
            return next(ApiError.internal('Internal server error while getting one application for adoption ' + error));
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
                return next(ApiError.badRequest(`There are no offer of adoption with ID: ${adoptionOfferId}`));
            }
            console.log(adoptionOffer);
            if (!await petAdoptionOfferService.isAdoptionOfferBelongToShelter(req.user.shelterId, adoptionOffer)){
                return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
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
            return next(ApiError.internal('Internal server error while getting application for one offer ' + error));
        }
    }

    async approvedApplication(req, res, next){
        try {
            const {applicationForAdoptionId} = req.params;
            const applicationForAdoption = await applicationForAdoptionService.findApplicationForAdoption(applicationForAdoptionId);

            if (!applicationForAdoption){
                return next(ApiError.badRequest(`There no application for adoption with ID: ${applicationForAdoptionId}`));
            }
            if (!await applicationForAdoptionService.isAdoptionApplicationBelongToShelter(req.user, applicationForAdoption)){
                return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
            }

            if (applicationForAdoption.is_application_approved){
                return next(ApiError.badRequest(`Application for adoption with ID: ${applicationForAdoptionId} is already approved`));
            }

            const adopter = await User.findOne({where: {id: applicationForAdoption.userId}});
            if (!adopter){
                return next(ApiError.badRequest(`Invalid user ID: ${applicationForAdoption.userId}`));
            }

            applicationForAdoption.is_application_approved = true;
            await applicationForAdoption.save();
            await applicationForAdoptionService.destroyAllOtherApplicationForAdoption(applicationForAdoption);

            const shelterInfo = await applicationForAdoptionService.getShelterInfo(applicationForAdoption);
            const petInfo = await applicationForAdoptionService.getAdoptedPetInfo(applicationForAdoption);

            const mailSubject = 'Підтвердження заявки';
            const mailText = `Шановний/шановна ${adopter.full_name}\n`
                + `\n`
                + `З радістю повідомляємо, що ваша заявка на усиновлення тепер одобрена!\n`
                + `\n`
                + `Інформація про притулок:`
                + `Назва приюту: ${shelterInfo.shelter_name}`
                + `Адреса: ${shelterInfo.shelter_address}`

                + `Ваш новий чотирилапий друг:\n`
                + `Ім'я тварини: ${petInfo.pet_name}\n`
                + `Вік: ${petInfo.pet_age}\n`
                + `Вид: ${petInfo.pet_kind}\n`
                + `Стать:  ${petInfo.pet_gender}\n`
                + `\n`
                + `Нехай цей момент стане початком довгого та щасливого спільного життя! `
                + `Будь ласка, звертайтеся до нас, якщо у вас є які-небудь питання чи потреба у допомозі.`
                + `\n`
                + `З найкращими побажаннями,\n`
                + `Команда ${shelterInfo.shelter_name}`;

            await nodemailer.sendEmail(adopter.email, mailSubject, mailText);

            return res.status(200).json(applicationForAdoption);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while approving application for adoption ' + error));
        }

    }
}

module.exports = new PetAdoptionApplicationController();