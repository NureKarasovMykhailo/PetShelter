const {Collar, Pet} = require('../models/models');
const ApiError = require("../error/ApiError");
const i18n = require('i18n');

class CollarService {

    async createCollar({
        minTemperature,
        maxTemperature,
        minPulse,
        maxPulse,
        shelterId
    }){
        return await Collar.create({
            min_temperature: minTemperature,
            max_temperature: maxTemperature,
            min_pulse: minPulse,
            max_pulse: maxPulse,
            shelterId,
        });
    }

    async getCollarById(collarId) {
        return await Collar.findOne({
            where: {id: collarId}
        });
    }

    async updateCollar(collar, {
        newMinTemperature,
        newMaxTemperature,
        newMinPulse,
        newMaxPulse
    }){
        collar.min_pulse = newMinPulse;
        collar.max_pulse = newMaxPulse;
        collar.min_temperature = newMinTemperature;
        collar.max_temperature = newMaxTemperature;
        await collar.save();
        return collar;
    }

    async getAllCollars(shelterId){
        return await Collar.findAll({
            where: {shelterId}
        });
    }

    async isCollarExistAndBelongToShelter (collar, collarId, shelterId)  {
        if (!collar){
            return ApiError.badRequest(i18n.__('collarIsNotFound') + collarId)
        }
        if (collar.shelterId !== shelterId){
            return ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation'));
        }
    }

    async isCollarOccupied (collarId){
        const petWithCheckedCollar = await Pet.findOne({where: {collarId}})
        if (petWithCheckedCollar){
            return true;
        }
        return false;
    }

    async setCollarToPet(collarId, petId) {
        const collar = await Collar.findOne({ where: { id: collarId } });
        const pet = await Pet.findOne({ where: { id: petId } });

        collar.petId = pet.id;
        pet.collarId = collar.id;

        await this.clearInformationAboutLastCollar(pet.id);

        await collar.save();
        await pet.save();

        return collar;
    }

    async clearInformationAboutLastCollar(petId) {
        const lastCollar = await Collar.findOne({ where: { petId } });
        if (lastCollar) {
            lastCollar.petId = null;
            await lastCollar.save();
        }
    }

    async deleteAllShelterCollars (shelterId){
        await Collar.destroy({
            where: {shelterId}
        });
    }
}

module.exports = new CollarService();