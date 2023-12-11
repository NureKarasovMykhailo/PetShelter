const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const petAdoptionOfferService = require('../services/PetAdoptionOfferService');
const petService = require('../services/PetService');
const pagination = require('../classes/Pagination');
const i18n = require('i18n');

const filterByShelter = (adoptionOffers, filteredShelters) => {
    const filteredAdoptionOffer = [];
    console.log(filteredShelters.length)
    adoptionOffers.map(adoptionOffer => {
       filteredShelters.map(filteredShelter => {
          if (adoptionOffer.pet.shelterId === filteredShelter.id){
              filteredAdoptionOffer.push(adoptionOffer);
          }
       });
    });
    console.log(filteredAdoptionOffer)
    return filteredAdoptionOffer;
}

class petAdoptionOfferController {

    async createPetAdoptionOffer(req, res, next){
        try {
            const {petId} = req.params;
            const {
                adoptionPrice,
                adoptionTelephone,
                adoptionEmail,
                adoptionInfo
            } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                const errorArray = errors.array();
                errorArray.forEach(error => {
                    error.msg = i18n.__(error.msg);
                });
                return next(ApiError.badRequest(errorArray));
            }

            if (!await petService.isPetBelongToShelter(petId, req.user.shelterId)) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }


            const createdPetAdoptionOffer = await petAdoptionOfferService.createPetAdoptionOffer({
                adoptionPrice,
                adoptionTelephone,
                adoptionEmail,
                adoptionInfo,
                petId
            });
            return res.status(200).json(createdPetAdoptionOffer);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async update(req, res, next){
        try {
            const {offerId} = req.params;
            const {
                adoptionPrice,
                adoptionTelephone,
                adoptionEmail,
                adoptionInfo
            } = req.body;

            const targetPetAdoptionOffer = await petAdoptionOfferService.getPetAdoptionOfferById(offerId);

            if (!targetPetAdoptionOffer){
                return next(ApiError.badRequest(i18n.__('thereAreNoAdoptionOfferWithId') + offerId));
            }
            if (!await petService.isPetBelongToShelter(targetPetAdoptionOffer.petId, req.user.shelterId)){
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()){
                const errorArray = errors.array();
                errorArray.forEach(error => {
                    error.msg = i18n.__(error.msg);
                });
                return next(ApiError.badRequest(errorArray));
            }

            const updatedPetAdoptionOffer = await petAdoptionOfferService.updatePetAdoptionOffer(targetPetAdoptionOffer, {
               adoptionInfo,
               adoptionEmail,
               adoptionPrice,
               adoptionTelephone
            });

            return res.status(200).json(updatedPetAdoptionOffer);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }

    }

    async deletePetAdoptionOffer(req, res, next){
        try {
            const {offerId} = req.params;
            const targetAdoptionOffer = await petAdoptionOfferService.getPetAdoptionOfferById(offerId);

            if (!targetAdoptionOffer){
                return next(ApiError.badRequest(i18n.__('thereAreNoAdoptionOfferWithId') + offerId));
            }

            if (!await petService.isPetBelongToShelter(targetAdoptionOffer.petId, req.user.shelterId)){
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            await targetAdoptionOffer.destroy();
            return res.json({message: i18n.__('adoptionOfferWasDeleted') + offerId});
        } catch (error){
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText') + error))
        }
    }

    async getOneAdoptionOffer(req, res, next){
        try{
            const {offerId} = req.params;
            const petAdoptionOffer = await petAdoptionOfferService.getPetAdoptionOfferById(offerId);
            if (!petAdoptionOffer){
                return next(ApiError.badRequest(i18n.__('thereAreNoAdoptionOfferWithId') + offerId));
            }
            return res.status(200).json(petAdoptionOffer);

        } catch (error) {
            console.log(error)
            return next(ApiError.internal(i18n.__('serverErrorText') + error));
        }
    }

    async getAllAdoptionOffers(req, res, next){
        try {
            let {
                country,
                city,
                petKind,
                petName,
                limit,
                page
            } = req.query;

            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;

            const filteredShelters = await petAdoptionOfferService.getFilteredShelters(country, city);
            let adoptionOffers = await petAdoptionOfferService.getAdoptionOffersWithPets(petKind, petName);

            if (filteredShelters) {
                adoptionOffers = filterByShelter(adoptionOffers, filteredShelters);
            }

            const paginatedAdoptionOffer = pagination.paginateItems(adoptionOffers, offset, limit);

            return res.json({
                adoptionOffer: paginatedAdoptionOffer.paginatedItems,
                pagination: {
                    totalItems: paginatedAdoptionOffer.itemCount,
                    totalPages: paginatedAdoptionOffer.totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });

       } catch (e) {
            console.log(e);
            return next(ApiError.internal(e));
       }
    }

}

module.exports = new petAdoptionOfferController();