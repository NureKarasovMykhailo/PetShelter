const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const {Pet,PetCharacteristic, User} = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const deletePetCharacteristics = async(petId) => {
    let petCharacteristics = null;
    petCharacteristics = await PetCharacteristic.findAll({where: {petId}});
    if (petCharacteristics){
        await Promise.all(petCharacteristics.map(async petCharacteristic => {
            await petCharacteristic.destroy();
        }));
    }
}

const setNewPetCharacteristics = async(info, petId) => {
    await Promise.all(info.map(async i => {
        PetCharacteristic.create(
            {
                title: i.title,
                description: i.description,
                petId: petId
            }
        );
    }));
}

class PetController {

    async create(req, res, next){
        let {
            petName,
            petAge,
            petGender,
            cellNumber,
            info
        } = req.body;
        const {petImage} = req.files;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }
        const petImageName = uuid.v4() + '.jpg';
        const pet = await Pet.create({
            pet_name: petName,
            pet_age: petAge,
            pet_gender: petGender,
            cell_number: cellNumber,
            pet_image: petImageName
        });
        if (info){
            info = JSON.parse(info);
            await Promise.all(info.map(async (i) => {
                await PetCharacteristic.create({
                    title: i.title,
                    description: i.description,
                    petId: pet.id
                });
            }));
        }
        pet.shelterId = req.user.shelterId;
        await pet.save();

        petImage.mv(path.resolve(__dirname, '..', 'static', petImageName));

        return res.json(pet);
    }

    async get(req, res){
        const shelterId = req.user.shelterId;
        console.log(shelterId)
        const pets = await Pet.findAll(
            {
                where: {shelterId},
                include: [{model: PetCharacteristic}]
            });
        return res.json(pets);
    }

    async getOne(req, res, next){
        const {id} = req.params;
        const pet = await Pet.findOne(
            {
                where: {id},
                include: [{model: PetCharacteristic}]
            });
        if (!pet) {
            return next(ApiError.badRequest(`There is not pet with id:${id}`));
        }
        if (pet.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You do not have access to information of this shelter'));
        }
        return res.json(pet);
    }

    async update(req, res, next){
        const {id} = req.params;
        const pet = await Pet.findOne({where: {id}});
        if (pet === null) {
            return next(ApiError.badRequest(`There is no pet with id: ${id}`));
        }
        if (pet.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You do not have access to information of this shelter'));
        }
        let {
            petName,
            petAge,
            petGender,
            cellNumber,
            info
        } = req.body;
        let petImage = null;
        if (req.files !== null) {
            petImage = req.files.petImage;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest(errors));
        }
        pet.pet_name = petName;
        pet.pet_age = petAge;
        pet.pet_gender = petGender;
        pet.cell_number = cellNumber;
        if (petImage !== null){
            let petImageName = uuid.v4() + '.jpg';
            fs.unlink(path.resolve(__dirname, '..', 'static', pet.pet_image), () => {
                console.log('Pet image was deleted');
            });
            pet.pet_image = petImageName;
            petImage.mv(path.resolve(__dirname, '..', 'static', petImageName));
        }
        if (info){
            info = JSON.parse(info);
            await deletePetCharacteristics(pet.id);
            await setNewPetCharacteristics(info, pet.id);
        }
        await pet.save();
        const petWithInfo = await Pet.findOne(
            {
                where: {id: pet.id},
                include: [{model: PetCharacteristic}]
            }
        )
        return res.json(petWithInfo);
    }

    async delete(req, res, next){
        const {id} = req.params;
        const pet = await Pet.findOne({where: {id}});
        if (pet === null) {
            next(ApiError.badRequest(`There is no pet with id: ${id}`));
        }
        if (pet.shelterId !== req.user.shelterId) {
            next(ApiError.forbidden('You do not have access to information of this shelter'));
        }
        fs.unlink(path.resolve(__dirname, '..', 'static', pet.pet_image), () => {
            console.log('Pet image was deleted');
        });
        await pet.destroy();
        return res.json({message: `Pet with id: ${id} was deleted`});
    }
}

module.exports = new PetController();