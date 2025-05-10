const models = require("../models/models");

class FeederInfoService {
    async deleteAllShelterFeedersInfo (shelterId){
        const feedersOfShelter = await models.Feeder.findAll({
            where: {shelterId}
        });
        await Promise.all(feedersOfShelter.map(async feeder => {
            await models.FeederInfo.destroy({
                where: {feederId: feeder.id}
            });
        }));
    }

}

module.exports = new FeederInfoService();