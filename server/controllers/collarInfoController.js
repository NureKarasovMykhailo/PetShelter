const ApiError = require('../error/ApiError');
const {CollarInfo} = require('../models/models');

class CollarInfoController {

    async createCollarInfo(req, res, next) {
        try {
            const {
                temperature,
                pulse,
                inSafeRadius
            } = req.body;
            const {collarId} = req.params;
            const createdCollarInfo = await CollarInfo.create({
                temperature,
                pulse,
                in_safe_radius: inSafeRadius,
                collarId
            });
            return res.status(200).json(createdCollarInfo);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while creating collar info ') + error);
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
            return next(ApiError.internal('Internal server error while creating collar info ') + error);
        }
    }

    async deleteCollarInfoById(req, res, next) {
        try {
            const {collarInfoId} = req.params;
            await CollarInfo.destroy({
                where: {id: collarInfoId}
            });
            return res.status(200).json({message: `Collars info with ID: ${collarInfoId} was deleted`});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while creating collar info ') + error);
        }
    }

    async clearCollarInfoForOneCollar(req, res, next) {
        try {
            const {collarId} = req.params;
            await CollarInfo.destroy({
                where: {collarId}
            });
            return res.status(200).json({message: `Collars info for collar ID: ${collarId} were deleted`});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while creating collar info ') + error);
        }
    }

}

module.exports = new CollarInfoController();