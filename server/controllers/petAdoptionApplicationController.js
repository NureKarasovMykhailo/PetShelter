const {AdoptionAnnouncement, ApplicationForAdoption, Pet} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const {Sequelize} = require("sequelize");
const getUserRoles = require('../middleware/getUserRoles');

const isAdoptionApplicationBelongToShelter = async (user, adoptionApplication) => {
    const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionApplication.adoptionAnnouncementId}});
    const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
    return pet.shelterId === user.shelterId;
}

const isAdoptionOfferBelongToShelter = async (shelterId, adoptionOffer) => {
    const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
    return shelterId === pet.shelterId;
}

const checkUserPermissionToApplicationForAdoption = async (roles, user, adoptionApplication) => {
    if (!(roles.includes('subscriber') || roles.includes('adoptionAdmin'))){
        return ApiError.forbidden('Access denied');
    }
    if (! await isAdoptionApplicationBelongToShelter(user, adoptionApplication)){
        return ApiError.forbidden('You don\'t have an access to information about this shelter');
    }
}

class PetAdoptionApplicationController{
    async create(req, res, next){
        const {adoptionOfferId} = req.params;
        const {
            applicationName,
            applicationAddress,
            applicationTelephone,
            applicationEmail
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }

        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionOfferId}});
        if (!adoptionOffer){
            return next(ApiError.badRequest(`There are no adoption offer with ID: ${adoptionOfferId}`));
        }

        const existedAdoptionApplication = await ApplicationForAdoption.findOne({
            where: {
                [Sequelize.Op.and]: [
                    {userId: req.user.id},
                    {adoptionAnnouncementId: adoptionOffer.id},
                ]
            }
        });
        if (existedAdoptionApplication){
            return next(ApiError.forbidden('You have already one application for adoption'));
        }

        if (existedAdoptionApplication){
            return next(ApiError.forbidden('You already have application of adoption'));
        }

        const applicationForAdoption = await ApplicationForAdoption.create(
            {
                application_name: applicationName,
                application_address: applicationAddress,
                application_telephone: applicationTelephone,
                application_email: applicationEmail,
                adoptionAnnouncementId: adoptionOfferId,
                userId: req.user.id
            }
        );
        return res.json({message: applicationForAdoption});
    }

    async delete(req, res, next){
        const {id} = req.params;
        const adoptionApplication = await ApplicationForAdoption.findOne({where: {id}});
        if (!adoptionApplication){
            return next(ApiError.badRequest(`There no application for adoption with ID: ${id}`));
        }
        if (adoptionApplication.userId === req.user.id){
            await adoptionApplication.destroy();
            return res.json({message: `Application for adoption with ID: ${id} was deleted`});
        }
        const roles = await getUserRoles(req.user);

        const error = await checkUserPermissionToApplicationForAdoption(
            roles,
            req.user,
            adoptionApplication
        );

        if (error){
            return next(error);
        }
        await adoptionApplication.destroy();
        return res.json({message: `Application for adoption with ID: ${id} was deleted`});
    }

    async getOne(req, res, next){
        const {id} = req.params;
        const adoptionApplication = await ApplicationForAdoption.findOne({where: {id}});
        if (!adoptionApplication){
            return next(ApiError.badRequest(`There no application for adoption with ID: ${id}`));
        }

        if (adoptionApplication.userId === req.user.id){
            return res.json({message: adoptionApplication});
        }
        const roles = await getUserRoles(req.user);

        const error = await checkUserPermissionToApplicationForAdoption(
            roles,
            req.user,
            adoptionApplication
        );

        if (error){
            return next(error);
        }

        return res.json({message: adoptionApplication});
    }

    async getAllForOneOffer(req, res, next){
        const {adoptionOfferId} = req.params;
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionOfferId}});
        if (!adoptionOffer){
            return next(ApiError.badRequest(`There are no offer of adoption with ID: ${adoptionOfferId}`));
        }
        if (!await isAdoptionOfferBelongToShelter(req.user.shelterId, adoptionOffer)){
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        const applicationsForAdoption = await ApplicationForAdoption.findAll(
            {where:
                    {adoptionAnnouncementId: adoptionOfferId}
            });
        return res.json({message: applicationsForAdoption});
    }
}

module.exports = new PetAdoptionApplicationController();