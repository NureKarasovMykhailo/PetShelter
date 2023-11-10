const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const {AdoptionAnnouncement, Pet} = require('../models/models');
const {isEmpty} = require("validator");

const isPetBelongToShelter = async (petId, shelterId) => {
    const pet = await Pet.findOne({where: {id: petId}});
    if (!pet){
        return false;
    }
    return pet.shelterId === shelterId;
}

class petAdoptionOfferController {

    async create(req, res, next){
        const {petId} = req.params;

        if (petId === null){
            return next(ApiError.badRequest('Invalid pet ID'));
        }

        const {
            adoptionPrice,
            adoptionTelephone,
            adoptionEmail,
            adoptionInfo
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }

        if (!await isPetBelongToShelter(petId, req.user.shelterId)) {
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        try {
            const petAdoptionOffer = await AdoptionAnnouncement.create(
                {
                    adoption_price: adoptionPrice,
                    adoption_telephone: adoptionTelephone,
                    adoption_email: adoptionEmail,
                    adoption_info: adoptionInfo,
                    petId: petId
                }
            );
            return res.json({message: petAdoptionOffer});
        } catch (e){
            return next(ApiError.internal(e));
        }
    }

    async update(req, res, next){
        const {offerId} = req.params;
        const {
            adoptionPrice,
            adoptionTelephone,
            adoptionEmail,
            adoptionInfo
        } = req.body;

        try {
            const petAdoptionOffer = await AdoptionAnnouncement.findOne({where: {id: offerId}});

            if (!petAdoptionOffer){
                return next(ApiError.badRequest(`There is no pet adoption offer with ID: ${offerId}`));
            }
            if (!await isPetBelongToShelter(petAdoptionOffer.petId, req.user.shelterId)){
                return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            petAdoptionOffer.adoption_price = adoptionPrice;
            petAdoptionOffer.adoption_telephone = adoptionTelephone;
            petAdoptionOffer.adoption_email = adoptionEmail;
            petAdoptionOffer.adoption_info = adoptionInfo;
            await petAdoptionOffer.save();
            return res.json({message: petAdoptionOffer});
        } catch (e){
            return ApiError.internal(e);
        }
    }

    async delete(req, res, next){
        const {offerId} = req.params;
        try {
            const adoptionOffer = await AdoptionAnnouncement.findOne(
                {where: {id: offerId}}
            )
            if (!adoptionOffer){
                return next(ApiError.badRequest(`There are no pet adoption offer with ID: ${offerId}`));
            }
            if (!await isPetBelongToShelter(adoptionOffer.petId, req.user.shelterId)){
                return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
            }
            await adoptionOffer.destroy();
            return res.json({message: `Pet adoption offer with ID: ${offerId} was deleted`});
        } catch (e){
            return next(ApiError.internal(e))
        }
    }

    async getOne(req, res, next){
        const {offerId} = req.params;
        try{
            const petAdoptionOffer = await AdoptionAnnouncement.findOne({where: {id: offerId}});
            if (!petAdoptionOffer){
                return next(ApiError.badRequest(`There are no pet adoption offer with ID: ${offerId}`));
            }
            return res.json({message: petAdoptionOffer});

        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async getAll(req, res, next){
        try{
            const petAdoptionOffers = await AdoptionAnnouncement.findAll();
            return res.json({message: petAdoptionOffers});
        } catch (e){
            return next(ApiError.internal(e));
        }
    }

}

module.exports = new petAdoptionOfferController();