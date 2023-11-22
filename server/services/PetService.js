const {PetCharacteristic, Pet} = require("../models/models");
const uuid = require('uuid');
const fs = require('node:fs');
const path = require('node:path');
const models = require("../models/models");

class PetService {

    async deletePetCharacteristics (petId) {
        let petCharacteristics = await PetCharacteristic.findAll({where: {petId}});
        if (petCharacteristics){
            await Promise.all(petCharacteristics.map(async petCharacteristic => {
                await petCharacteristic.destroy();
            }));
        }
    }

    async setNewPetCharacteristics (info, petId)  {
        await Promise.all(info.map(async i => {
            await PetCharacteristic.create(
                {
                    title: i.title,
                    description: i.description,
                    petId: petId
                }
            );
        }));
    }

    async createPet({
        petName,
        petAge,
        petGender,
        cellNumber,
        petImageName,
        petKind,
        shelterId,
        info,
    }){

        const pet = await Pet.create({
            pet_name: petName,
            pet_age: petAge,
            pet_gender: petGender,
            cell_number: cellNumber,
            pet_image: petImageName,
            pet_kind: petKind
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
        pet.shelterId = shelterId;
        await pet.save();

        return pet;
    }

    async getPetsWithCharacteristics(whereCondition) {
        return await Pet.findAll({
            where: whereCondition,
            include: [{ model: PetCharacteristic }],
        });
    }

    async getFilteredPets(shelterId, petKind, gender) {
        let whereCondition = { shelterId };
        if (petKind) {
            whereCondition.pet_kind = petKind;
        }
        if (gender) {
            whereCondition.pet_gender = gender;
        }

        return await this.getPetsWithCharacteristics(whereCondition);
    }

    getFilteredPetsByFeeder(pets, withOutFeeder) {
        return pets.filter(
            (pet) =>
                withOutFeeder
                    ? !pet.feederId
                    : pet.feederId !== null && pet.feederId !== undefined
        );
    }

    getPetsByName(pets, petName) {
        return pets.filter((pet) => pet.pet_name === petName);
    }

    sortPets(pets, sortByName, sortByAge) {
        if (sortByName === 'asc') {
            pets.sort((a, b) => a.pet_name.localeCompare(b.pet_name));
        } else if (sortByName === 'desc') {
            pets.sort((a, b) => b.pet_name.localeCompare(a.pet_name));
        }

        if (sortByAge === 'asc') {
            pets.sort((a, b) => a.pet_age - b.pet_age);
        } else if (sortByAge === 'desc') {
            pets.sort((a, b) => b.pet_age - a.pet_age);
        }

        return pets;
    }

    async getPetByIdWithCharacteristics(id) {
        return await Pet.findOne({
            where: { id },
            include: [{ model: PetCharacteristic }],
        });
    }

    async getPetById(id) {
        return await Pet.findOne({ where: { id } });
    }

    async updatePetData(updatingPet, {
        petName,
        petAge,
        petGender,
        cellNumber,
        petKind,
        info,
        newPetImage
    }){
        updatingPet.pet_name = petName;
        updatingPet.pet_age = petAge;
        updatingPet.pet_gender = petGender;
        updatingPet.cell_number = cellNumber;
        updatingPet.pet_kind = petKind;

        if (newPetImage) {
            const petImageName = uuid.v4() + '.jpg';
            fs.unlink(path.resolve(__dirname, '..', 'static', updatingPet.pet_image), () => {
                console.log('Pet image was deleted');
            });
            updatingPet.pet_image = petImageName;
            await newPetImage.mv(path.resolve(__dirname, '..', 'static', petImageName));
        }

        console.log(info);
        if (info) {
            info = JSON.parse(info);
            await this.deletePetCharacteristics(updatingPet.id);
            await this.setNewPetCharacteristics(info, updatingPet.id);
        }

        await updatingPet.save();
        return updatingPet;
    }

    async deletePetImage(petImage) {
        return new Promise((resolve) => {
            fs.unlink(path.resolve(__dirname, '..', 'static', petImage), (err) => {
                if (err) {
                    console.error('Error deleting pet image:', err);
                } else {
                    console.log('Pet image was deleted');
                }
                resolve();
            });
        });
    }

    async destroyPet(pet) {
        await pet.destroy();
    }

    async isPetBelongToShelter (petId, shelterId){
        const pet = await Pet.findOne({where: {id: petId}});
        if (!pet){
            return false;
        }
        return pet.shelterId === shelterId;
    }

    async deleteAllShelterPetsCharacteristics (shelterId){
        const petsArr = await models.Pet.findAll({
            where: {shelterId}
        });
        await Promise.all(petsArr.map(async pet => {
            await models.PetCharacteristic.destroy({
                where: {petId: pet.id}
            });
        }));
    }

    async deleteAllShelterPets (shelterId){
        let petImageNames;
        petImageNames = await models.Pet.findAll({
            where: {shelterId},
            attributes: ['pet_image']
        });
        await Promise.all(petImageNames.map(async petImageName => {
            fs.unlink(
                path.resolve(__dirname, '..', 'static', petImageName.pet_image),
                () => `${petImageName} was deleted`
            );
        }));
        await models.Pet.destroy({
            where: {shelterId}
        });
    }

}

module.exports = new PetService();