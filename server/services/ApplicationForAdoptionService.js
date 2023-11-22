const {ApplicationForAdoption, AdoptionAnnouncement, Pet, Shelter} = require("../models/models");
const {Sequelize} = require("sequelize");
const ApiError = require("../error/ApiError");
const models = require("../models/models");


class ApplicationForAdoptionService {

    async findApplicationForAdoption(userId, adoptionOfferId){
        return ApplicationForAdoption.findOne({
            where: {
                [Sequelize.Op.and]: [
                    {userId: userId},
                    {adoptionAnnouncementId: adoptionOfferId},
                ]
            }
        });

    }
    async findApplicationForAdoption(applicationForAdoptionId){
        return await ApplicationForAdoption.findOne({where: {id: applicationForAdoptionId}});
    }

    async createApplicationForAdoption({applicationAddress, adoptionOfferId, userId}){
        return await ApplicationForAdoption.create(
            {
                application_address: applicationAddress,
                adoptionAnnouncementId: adoptionOfferId,
                is_application_approved: false,
                userId: userId
            }
        );
    }

    async checkUserPermissionToApplicationForAdoption (roles, user, adoptionApplication) {
        if (!(roles.includes('subscriber') || roles.includes('adoptionAdmin'))){
            return ApiError.forbidden('Access denied');
        }
        if (! await this.isAdoptionApplicationBelongToShelter(user, adoptionApplication)){
            return ApiError.forbidden('You don\'t have an access to information about this shelter');
        }
    }

    async isAdoptionApplicationBelongToShelter (user, adoptionApplication){
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionApplication.adoptionAnnouncementId}});
        const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
        return pet.shelterId === user.shelterId;
    }

    async filterApplicationsByName(adoptionOfferId, adopterName) {
        return await ApplicationForAdoption.findAll({
            where: { adoptionAnnouncementId: adoptionOfferId, application_name: adopterName },
        });
    }

    async getAllApplications(adoptionOfferId) {
        return await ApplicationForAdoption.findAll({
            where: { adoptionAnnouncementId: adoptionOfferId },
        });
    }

    sortApplications(applications, sortBy) {
        if (sortBy === 'desc') {
            applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'asc') {
            applications.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    }

    async destroyAllOtherApplicationForAdoption (applicationForAdoption){
        await ApplicationForAdoption.destroy({
            where: {adoptionAnnouncementId: applicationForAdoption.adoptionAnnouncementId, is_application_approved: false}
        });
    }

    async getAdoptedPetInfo(adoptionAnnouncement){
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionAnnouncement.id}});
        return await Pet.findOne({where: {id: adoptionOffer.petId}})
    }

    async getShelterInfo (applicationForAdoption){
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: applicationForAdoption.adoptionAnnouncementId}});
        const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
        return await Shelter.findOne({where: {id: pet.shelterId}});
    }

    async deleteAllShelterApplicationForAdoption (shelterId){
        const adoptionOffers = await models.AdoptionAnnouncement.findAll({
            include: [{
                model: models.Pet,
                attributes: [],
                where: {shelterId}
            }]
        });
        await Promise.all(adoptionOffers.map(async adoptionOffer => {
            await models.ApplicationForAdoption.destroy({
                where: {adoptionAnnouncementId: adoptionOffer.id}
            })
        }));
    }
}

module.exports = new ApplicationForAdoptionService();