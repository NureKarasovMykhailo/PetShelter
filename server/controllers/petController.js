const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('node:path');
const petService = require('../services/PetService');
const pagination = require('../classes/Pagination');

class PetController {

    async createPet(req, res, next){
        try{
            let {
                petName,
                petAge,
                petGender,
                cellNumber,
                petKind,
                info
            } = req.body;
            const {petImage} = req.files;

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const petImageName = uuid.v4() + '.jpg';

            const createdPet = await petService.createPet({
                petName,
                petAge,
                petGender,
                cellNumber,
                petKind,
                petImageName,
                shelterId: req.user.shelterId,
                info,
            });

            await petImage.mv(path.resolve(__dirname, '..', 'static', petImageName));

            return res.status(200).json(createdPet);
        } catch (error){
            console.log(error);
            return next(ApiError.internal('Internal server error while creating pet: ' + error));
        }
    }

    async getAllPets(req, res, next){
       try{
           let {
               petKind,
               gender,
               petName,
               withOutFeeder,
               limit,
               page,
               sortByName,
               sortByAge
           } = req.query;
           limit = limit || 9;
           page = page || 1;
           let offset = page * limit - limit;

           let pets = await petService.getFilteredPets(req.user.shelterId, petKind, gender);

           if (petName){
               pets = petService.getPetsByName(pets, petName);
           }

           if (withOutFeeder) {
               pets = petService.getFilteredPetsByFeeder(pets, withOutFeeder);
           }

           pets = petService.sortPets(pets, sortByName, sortByAge);

           const paginatedPets = pagination.paginateItems(pets, offset, limit);

           return res.status(200).json({
               pets: paginatedPets.paginatedItems,
               pagination: {
                   totalItems: paginatedPets.itemCount,
                   totalPages: paginatedPets.totalPages,
                   currentPage: page,
                   itemsPerPage: limit
               }
           });
       } catch (error){
           console.log(error);
           return next(ApiError.internal('Internal server error while getting all pets' + error))
       }
    }

    async getOnePetWithCharacteristics(req, res, next){
        try {
            const {petId} = req.params;
            const targetPet = await petService.getPetByIdWithCharacteristics(petId);

            if (!targetPet) {
                return next(ApiError.badRequest(`There is no pet with id: ${petId}`));
            }
            if (targetPet.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }
            return res.status(200).json({pets: targetPet});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while getting one pet ' + error));
        }
    }

    async updatePet(req, res, next){
        try {
            const {
                petName,
                petAge,
                petGender,
                cellNumber,
                petKind,
                info
            } = req.body;
            let petImage = null;

            const {petId} = req.params;
            const targetPet = await petService.getPetById(petId);

            if (!targetPet) {
                return next(ApiError.notFound(`There is no pet with id: ${petId}`));
            }

            if (targetPet.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            if (req.files !== null) {
                petImage = req.files.petImage;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(errors));
            }

            const updatedPet = await petService.updatePetData(targetPet, {
                petName,
                petAge,
                petGender,
                cellNumber,
                petKind,
                info,
                newPetImage: petImage
            });

            return res.status(200).json(updatedPet);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while updating pet ' + error));
        }
    }

    async deletePet(req, res, next){
        try {
            const {petId} = req.params;
            const targetPet = await petService.getPetById(petId);

            if (!targetPet) {
                next(ApiError.badRequest(`There is no pet with id: ${petId}`));
            }
            if (targetPet.shelterId !== req.user.shelterId) {
                next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            await petService.deletePetImage(targetPet.pet_image);
            await petService.destroyPet(targetPet);

            return res.status(200).json({message: `Pet with id: ${petId} was deleted`});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while deleting pet ' + error));
        }
    }
}

module.exports = new PetController();