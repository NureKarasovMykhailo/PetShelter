const ApiError = require('../error/ApiError');
const {CollarInfo, Collar, Pet} = require('../models/models');
const i18n = require('i18n');

class CollarInfoController {

    async createCollarInfo(req, res, next) {
        try {
            const {
                temperature,
                pulse,
                inSafeRadius,
            } = req.body;
            const {collarId} = req.params;
            const createdCollarInfo = await CollarInfo.create({
                temperature,
                pulse,
                in_safe_radius: inSafeRadius,
                collarId,
            });

            const collar = await Collar.findOne({
                where: {id: collarId}
            });
            let message = '';
            let isPetProblemExist = false;
            if (!inSafeRadius){
                isPetProblemExist = true;
                message += i18n.__('collarInfoAnimalNotInSaveRadius');
            }
            if (temperature > collar.max_temperature || temperature < collar.min_temperature) {
                isPetProblemExist = true;
                message += i18n.__('collarInfoAnimalTempIsNotRight');
            }

            if (pulse > collar.max_temperature || pulse < collar.min_temperature) {
                isPetProblemExist = true;
                message += i18n.__('collarInfoAnimalPulseIsNotRight');
            }

            if (isPetProblemExist){
                createdCollarInfo.message = message;
                await createdCollarInfo.save();
                const problemPet = await Pet.findOne({
                    where: {collarId}
                });
                problemPet.is_status_normal = false;
                await problemPet.save();
            } else {
                createdCollarInfo.message = i18n.__('collarInfoNormal');
                await createdCollarInfo.save();
                const pet = await Pet.find({
                    where: {collarId}
                });
                pet.is_status_normal = true;
                await pet.save();
            }

            return res.status(200).json(createdCollarInfo);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText')) + error);
        }
    }

    async getCollarInfoForOneCollar(req, res, next) {
        try {
            const {collarId} = req.params;
            const collarInfos = await CollarInfo.findAll({
                collarId
            });
            return res.status(200).json(collarInfos);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText')) + error);
        }
    }

    async deleteCollarInfoById(req, res, next) {
        try {
            const {collarInfoId} = req.params;
            await CollarInfo.destroy({
                where: {id: collarInfoId}
            });
            return res.status(200).json({message: i18n.__('collarInfoWasDeleted') + collarInfoId });
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText')) + error);
        }
    }

    async clearCollarInfoForOneCollar(req, res, next) {
        try {
            const {collarId} = req.params;
            await CollarInfo.destroy({
                where: {collarId}
            });
            return res.status(200).json({message: i18n.__('collarInfoForCollarWasDeleted') + collarId});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal(i18n.__('serverErrorText')) + error);
        }
    }

}

module.exports = new CollarInfoController();