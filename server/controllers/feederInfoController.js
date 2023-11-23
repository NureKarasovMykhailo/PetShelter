const {FeederInfo, Pet, Feeder} = require('../models/models');
const ApiError = require('../error/ApiError');

class FeederInfoController {

    async createFeederInfo(req, res, next){
        try {
            const {
                amountOfFood,
                feedingTime,
                createdAt
            } = req.body;
            const {feederId} = req.params;

            const lastFeedingInfo = await FeederInfo.findOne({
                where: {
                    feederId: feederId
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });



            const feederInfo = await FeederInfo.create({
                amount_of_food: amountOfFood,
                feeding_time: feedingTime,
                feederId: feederId,
            });


            if (lastFeedingInfo) {
                const timeBetweenFeeding = feederInfo.createdAt - lastFeedingInfo.createdAt;
                const oneDayInMinutes = 24 * 60;

                if (timeBetweenFeeding >= oneDayInMinutes) {
                    feederInfo.message = 'The animal has not eaten for a day';
                    const problemPet = await Pet.findOne({
                        where: {feederId}
                    });
                    problemPet.is_status_normal = false;
                    await problemPet.save();
                } else {
                    feederInfo.message = 'normal';
                    const pet = await Pet.findOne({
                        where: {feederId}
                    });
                    pet.is_status_normal = true;
                    await pet.save();
                }
            }

            return res.status(200).json(feederInfo);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while creating feeder info ' + error));
        }
    }

    async getAllInfoForOneFeeder(req, res, next) {
        try {
            const {feederId} = req.params;
            const feederInfos = await FeederInfo.findAll({
                where: {feeder_id: feederId}
            });
            return res.status(200).json(feederInfos);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while getting feeder info ' + error));
        }
    }

    async clearFeederInfoForOneFeeder(req, res, next) {
        try {
            const {feederId} = req.params;
            await FeederInfo.destroy({
                where: {feeder_id: feederId}
            });
            return res.status(200).json({message: `Feeder infos for feeder ID: ${feederId} were cleared`});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while clearing feeder info ' + error));
        }
    }

    async clearOneFeederInfo (req, res, next) {
        try {
            const {feederInfoId} = req.params;
            await FeederInfo.destroy({
                where: {id: feederInfoId}
            });
            return res.status(200).json(`Feeder info with ID: ${feederInfoId} was deleted`);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while deleting feeder info ' + error));
        }
    }



}


module.exports = new FeederInfoController();