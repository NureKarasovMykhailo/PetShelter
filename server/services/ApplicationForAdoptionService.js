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
                    {adoptionOfferId: adoptionOfferId},
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
                adoptionOfferId: adoptionOfferId,
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
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionApplication.adoptionOfferId}});
        console.log(adoptionOffer)
        const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
        return pet.shelterId === user.shelterId;
    }

    async filterApplicationsByName(adoptionOfferId, adopterName) {
        return await ApplicationForAdoption.findAll({
            where: { adoptionOfferId: adoptionOfferId, application_name: adopterName },
        });
    }

    async getAllApplications(adoptionOfferId) {
        return await ApplicationForAdoption.findAll({
            where: { adoptionOfferId: adoptionOfferId },
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
        console.log(applicationForAdoption.adoptionOfferId)
        await ApplicationForAdoption.destroy({
            where: {adoptionOfferId: applicationForAdoption.adoptionOfferId, is_application_approved: false}
        });
        console.log(applicationForAdoption)
    }

    async getAdoptedPetInfo(adoptionAnnouncement){
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: adoptionAnnouncement.adoptionOfferId}});
        console.log(adoptionOffer);
        return await Pet.findOne({where: {id: adoptionOffer.petId}})
    }

    async getShelterInfo (applicationForAdoption){
        const adoptionOffer = await AdoptionAnnouncement.findOne({where: {id: applicationForAdoption.adoptionOfferId}});
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
                where: {adoptionOfferId: adoptionOffer.id}
            })
        }));
    }
}

module.exports = new ApplicationForAdoptionService();