const {CollarInfo, Collar} = require('../models/models');

class CollarInfoService {
    async deleteCollarInfoByCollarId(collarId){
        await CollarInfo.destroy({
            where: {collarId}
        });
    }

    async deleteAllShelterCollarsInfo (shelterId){
        const collarsOfShelter = await Collar.findAll({
            where: {shelterId}
        });
        await Promise.all(collarsOfShelter.map(async collar => {
            await Collar.destroy({
                where: {feederId: collar.id}
            });
        }));
    }
}

module.exports = new CollarInfoService();