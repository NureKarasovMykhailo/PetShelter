const {Pet, Feeder} = require("../models/models");
const models = require("../models/models");

class FeederService {
    async isFeederOccupied (feederId){
        const petWithCheckedFeeder = await Pet.findOne({where: {feederId}})
        if (petWithCheckedFeeder){
            return true;
        }
        return false;
    }

    async createFeeder({capacity, designedFor, feederColour, shelterId}){
        return await Feeder.create(
            {
                capacity: capacity,
                designed_for: designedFor,
                feeder_colour: feederColour,
                shelterId: shelterId
            }
        );
    }

    async getFeederById(feederId) {
        return Feeder.findOne({ where: { id: feederId } });
    }

    async updateFeederData(feeder, { capacity, designedFor, feederColour }) {
        feeder.feeder_colour = feederColour;
        feeder.capacity = capacity;
        feeder.designed_for = designedFor;
        await feeder.save();
        return feeder;
    }

    async getFilteredFeeders({ designedFor, isEmpty, shelterId }) {
        let whereCondition = {};
        whereCondition.shelterId = shelterId;

        if (designedFor) {
            whereCondition.designed_for = designedFor;
        }

        if (isEmpty === 'true') {
            whereCondition.petId = null;
        }

        return await Feeder.findAll({
            where: whereCondition,
            include: [{
                model: Pet,
                attributes: ['id', 'pet_name'],
            }]
        });

    }

    async setFeederToPet(feederId, petId) {
        const feeder = await Feeder.findOne({ where: { id: feederId } });
        const pet = await Pet.findOne({ where: { id: petId } });

        // Привязываем кормушку к питомцу
        feeder.petId = pet.id;
        pet.feederId = feeder.id;

        // Очищаем информацию о предыдущей кормушке питомца
        await this.clearInformationAboutLastFeeder(pet.id);

        // Сохраняем изменения
        await feeder.save();
        await pet.save();

        return feeder;
    }

    async clearInformationAboutLastFeeder(petId) {
        const lastFeeder = await Feeder.findOne({ where: { petId } });
        if (lastFeeder) {
            lastFeeder.petId = null;
            await lastFeeder.save();
        }
    }

    async deleteAllShelterFeeders (shelterId){
        await models.Feeder.destroy({
            where: {shelterId}
        });
    }

}

module.exports = new FeederService();