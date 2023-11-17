const {AdoptionAnnouncement, ApplicationForAdoption, Pet, User, Shelter} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const {Sequelize} = require("sequelize");
const getUserRoles = require('../middleware/getUserRoles');
const transporter = require("../nodemailerConfig");
const {app} = require("../index");
const {application} = require("express");

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

const getShelterInfo = async (applicationForAdoption) => {
    const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: applicationForAdoption.adoptionAnnouncementId}});
    const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
    return await Shelter.findOne({where: {id: pet.shelterId}});
}

const getPetInfo = async (applicationForAdoption) => {
    const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: applicationForAdoption.adoptionAnnouncementId}});
    return await Pet.findOne({where: {id: adoptionOffer.petId}});
}

const destroyAllOtherApplicationForAdoption = async (applicationForAdoption) => {
    await ApplicationForAdoption.destroy({
        where: {adoptionAnnouncementId: applicationForAdoption.adoptionAnnouncementId, is_application_approved: false}
    });
}

class PetAdoptionApplicationController{
    async create(req, res, next){
        const {adoptionOfferId} = req.params;
        const {
            applicationAddress,
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
                application_address: applicationAddress,
                adoptionAnnouncementId: adoptionOfferId,
                is_application_approved: false,
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
        let {
            adopterName,
            page,
            limit,
            sortBy
        } = req.query;

        page = page || 1;
        limit = limit || 9;

        let offset = page * limit - limit;
        console.log(adoptionOfferId)

        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionOfferId}});
        if (!adoptionOffer){
            return next(ApiError.badRequest(`There are no offer of adoption with ID: ${adoptionOfferId}`));
        }
        if (!await isAdoptionOfferBelongToShelter(req.user.shelterId, adoptionOffer)){
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        let applicationForAdoption;
        if (adopterName){
            applicationForAdoption = await ApplicationForAdoption.findAll({
               where: {adoptionAnnouncementId: adoptionOffer.id, application_name: adopterName},
            });
        } else {
            applicationForAdoption = await ApplicationForAdoption.findAll({
                where: {adoptionAnnouncementId: adoptionOffer.id},
            });
        }

        if (sortBy === 'desc'){
            applicationForAdoption.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else if (sortBy === 'asc'){
            applicationForAdoption.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        }

        const applicationForAdoptionCount = applicationForAdoption.length;
        let totalPages = Math.ceil(applicationForAdoptionCount / limit);
        const paginatedApplicationForAdoption = applicationForAdoption.splice(offset, offset + limit);

        return res.json({
            applicationForAdoption: paginatedApplicationForAdoption,
            pagination: {
                totalItems: applicationForAdoptionCount,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    }

    async approvedApplication(req, res, next){
        const {id} = req.params;
        const applicationForAdoption = await ApplicationForAdoption.findOne({where: {id}});
        if (!applicationForAdoption){
            return next(ApiError.badRequest(`There no application for adoption with ID: ${id}`));
        }
        if (! await isAdoptionApplicationBelongToShelter(req.user, applicationForAdoption)){
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        if (applicationForAdoption.is_application_approved){
            return next(ApiError.badRequest(`Application for adoption with ID: ${id} is already approved`));
        }

        const adopter = await User.findOne({where: {id: applicationForAdoption.userId}});
        if (!adopter){
            return next(ApiError.badRequest(`Invalid user ID: ${applicationForAdoption.userId}`));
        }
        applicationForAdoption.is_application_approved = true;
        await applicationForAdoption.save();
        await destroyAllOtherApplicationForAdoption(applicationForAdoption);

        const shelterInfo = await getShelterInfo(applicationForAdoption);
        const petInfo = await getPetInfo(applicationForAdoption);
        const mailOptions = {
            from: 'petshelter04@ukr.net',
            to: `${adopter.email}`,
            subject: 'Підтвердження заявки',
            text: `Шановний/шановна ${adopter.full_name},

З радістю повідомляємо, що ваша заявка на усиновлення тепер одобрена!

Інформація про притулок:
Назва приюту: ${shelterInfo.shelter_name}
Адреса: ${shelterInfo.shelter_address}

Ваш новий чотирилапий друг:
Ім'я тварини: ${petInfo.pet_name}
Вік: ${petInfo.pet_age}
Вид: ${petInfo.pet_kind}
Стать:  ${petInfo.pet_gender}

Нехай цей момент стане початком довгого та щасливого спільного життя! Будь ласка, звертайтеся до нас, якщо у вас є які-небудь питання чи потреба у допомозі.

З найкращими побажаннями,
Команда ${shelterInfo.shelter_name}`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error while sending email: ' + error);
                return next(ApiError.internal('Error while sending email'))
            }
        });

        return res.status(200).json({applicationForAdoption: applicationForAdoption});

    }
}

module.exports = new PetAdoptionApplicationController();