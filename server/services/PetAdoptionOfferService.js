const {AdoptionAnnouncement, Pet, Shelter, PetCharacteristic} = require("../models/models");
const {Sequelize} = require('sequelize');
const models = require("../models/models");

class PetAdoptionOfferService {

    async createPetAdoptionOffer({
        adoptionPrice,
        adoptionTelephone,
        adoptionEmail,
        adoptionInfo,
        petId
    }){
        return await AdoptionAnnouncement.create(
            {
                adoption_price: adoptionPrice,
                adoption_telephone: adoptionTelephone,
                adoption_email: adoptionEmail,
                adoption_info: adoptionInfo,
                petId: petId
            }
        );
    }

    async getPetAdoptionOfferById(adoptionOfferId){
        return await AdoptionAnnouncement.findOne({where: {id: adoptionOfferId}});
    }

    async updatePetAdoptionOffer(adoptionOffer, {
        adoptionPrice,
        adoptionTelephone,
        adoptionEmail,
        adoptionInfo,
    }){
        adoptionOffer.adoption_price = adoptionPrice;
        adoptionOffer.adoption_telephone = adoptionTelephone;
        adoptionOffer.adoption_email = adoptionEmail;
        adoptionOffer.adoption_info = adoptionInfo;
        await adoptionOffer.save();
        return adoptionOffer;
    }

    async getFilteredShelters(country, city) {
        let filteredShelters = null;

        if (country && city) {
            filteredShelters = await Shelter.findAll({
                where: {
                    [Sequelize.Op.and]: [
                        { shelter_address: { [Sequelize.Op.like]: `%${city}%` } },
                        { shelter_address: { [Sequelize.Op.like]: `%${country}%` } }
                    ]
                }
            });
        } else if (!country && city) {
            filteredShelters = await Shelter.findAll({
                where: { shelter_address: { [Sequelize.Op.like]: `%${city}%` } }
            });
        } else if (country && !city) {
            filteredShelters = await Shelter.findAll({
                where: { shelter_address: { [Sequelize.Op.like]: `%${country}%` } }
            });
        }

        return filteredShelters;
    }

    async getAdoptionOffersWithPets(petKind, petName) {
        const petFilter = {};
        if (petKind) petFilter.pet_kind = petKind;
        if (petName) petFilter.pet_name = petName;

        return AdoptionAnnouncement.findAll({
            include: [
                {
                    model: Pet,
                    where: petFilter,
                    include: [{ model: PetCharacteristic }, { model: Shelter }]
                }
            ]
        });
    }

    async isAdoptionOfferBelongToShelter (shelterId, adoptionOffer){
        const pet = await Pet.findOne({where: {id: adoptionOffer.petId}});
        return shelterId === pet.shelterId;
    }

    async deleteAllShelterAdoptionOffers (shelterId){
        const adoptionOffers = await models.AdoptionAnnouncement.findAll({
            include: [{
                model: models.Pet,
                attributes: [],
                where: {shelterId}
            }]
        });
        await Promise.all(adoptionOffers.map(async adoptionOffer => {
            await adoptionOffer.destroy()
        }));
    }

}

module.exports = new PetAdoptionOfferService();