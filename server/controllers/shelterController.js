const {User} = require('../models/models')
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const {validationResult} = require('express-validator')
const path = require("node:path");
const generateJWT = require('../functions/generateJwt');
const getUserRoles = require('../middleware/getUserRoles');
const shelterService = require('../services/ShelterService');
const userService = require('../services/UserService');
const pagination = require('../classes/Pagination');

class ShelterController {

    constructor() {
        this.createShelter = this.createShelter.bind(this);
    }

    async createShelter(req, res, next) {
        try {
            const {
                shelterName,
                shelterCountry,
                shelterCity,
                shelterStreet,
                shelterHouse,
                shelterDomain,
                subscriberDomainEmail
            } = req.body;

            let {shelterImage, shelterImageName} = await this._getImageName(req);

            let isShelterExist = await shelterService.isShelterExistChecking(shelterName, shelterDomain);

            if (isShelterExist) {
                return next(ApiError.badRequest('Shelter with this data already exists'));
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(errors));
            }

            const shelterFullAddress = `${shelterCountry} ${shelterCity} ${shelterStreet} ${shelterHouse}`;
            const createdShelter = await shelterService.createShelter({
                shelterDomain,
                shelterFullAddress,
                shelterName,
                shelterImageName,
                userId: req.user.id
            });

            const shelterCreator = await this._changeShelterCreatorData(req.user.id, subscriberDomainEmail, shelterDomain, createdShelter.id);

            const roles = await getUserRoles(shelterCreator);
            const newToken = await generateJWT(
                shelterCreator.id,
                shelterCreator.login,
                shelterCreator.user_image,
                shelterCreator.domain_email,
                shelterCreator.email,
                shelterCreator.full_name,
                shelterCreator.birthday,
                shelterCreator.phone_number,
                shelterCreator.is_paid,
                shelterCreator.shelterId,
                roles,
            );

            if (shelterImageName !== 'default-shelter-image.jpg') {
                await shelterImage.mv(path.resolve(__dirname, '..', 'static', shelterImageName));
            }
            return res.status(200).json({shelter: createdShelter, token: newToken});

        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server error while creating new shelter' + error));
        }
    }

    async _changeShelterCreatorData(userId, subscriberDomainEmail, shelterDomain, shelterId){
        const user = await User.findOne({where: {id: userId}});
        user.domain_email = subscriberDomainEmail + shelterDomain;
        user.shelterId = shelterId;
        await user.save();
        return user;
    }

    async _getImageName(req) {
        let shelterImage;
        let shelterImageName;
        if (!req.files || Object.keys(req.files).length === 0) {
            shelterImageName = 'default-shelter-image.jpg';
        } else {
            shelterImage = req.files.shelterImage;
            shelterImageName = uuid.v4() + '.jpg';
        }
        return {shelterImage, shelterImageName};
    }

    async getShelterById(req, res, next) {
        try {
            const {shelterId} = req.params;
            const targetShelter = await shelterService.getShelterById(shelterId);
            if (!targetShelter) {
                return next(ApiError.notFound(`There is no shelter with ID: ${shelterId}`));
            }
            if (req.user.shelterId !== targetShelter.id) {
                return next(ApiError.forbidden('You do not have access to this shelter'));
            }
            return res.status(200).json(targetShelter);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server error while getting shelter\'s info ' + error));
        }
    }

    async updateShelter(req, res, next) {
        try {
            const {shelterId} = req.params;
            const {
                newShelterName,
                newShelterCountry,
                newShelterCity,
                newShelterStreet,
                newShelterHouse,
                newShelterDomain
            } = req.body;

            let shelterImage = null;
            if (req.files !== null) {
                shelterImage = req.files.shelterImage;
            }

            let targetShelter = await shelterService.getShelterById(shelterId);
            if (!targetShelter) {
                return next(ApiError.notFound(`There is no shelter with ID: ${shelterId}`));
            }
            let requestedUser = await User.findOne({where: {id: req.user.id}});

            if (req.user.shelterId !== targetShelter.id) {
                return next(ApiError.forbidden('You do not have access to this shelter'));
            }


            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            if (newShelterName !== targetShelter.shelter_name) {
                if (!await shelterService.isShelterNameExist(newShelterName)) {
                    return next(ApiError.badRequest('Shelter with this data already exists'));
                }
            }
            if (newShelterDomain !== targetShelter.shelter_domain) {
                if (!await shelterService.isShelterDomainExist(newShelterDomain)) {
                    return next(ApiError.badRequest('Shelter with this data already exists'));
                }
            }

            const newShelterAddress = `${newShelterCountry} ${newShelterCity} ${newShelterStreet} ${newShelterHouse}`;
            await userService.changeUsersDomain(targetShelter.id, targetShelter.domain_email, newShelterDomain);

            let updatedShelter = await shelterService.updateShelter(targetShelter, {
                newShelterName,
                newShelterDomain,
                newShelterAddress
            });

            if (shelterImage !== null) {
                updatedShelter = await shelterService.changeShelterImage(shelterImage, updatedShelter);
            }
            const roles = await getUserRoles(requestedUser);
            const newToken = await generateJWT(
                requestedUser.id,
                requestedUser.login,
                requestedUser.user_image,
                requestedUser.domain_email,
                requestedUser.email,
                requestedUser.full_name,
                requestedUser.birthday,
                requestedUser.phone_number,
                requestedUser.is_paid,
                requestedUser.shelterId,
                roles,
            );
            return res.json({shelter: updatedShelter, token: newToken});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server error while updating shelter ' + error));
        }
    }

    async deleteShelterByToken(req, res, next){
        const deleteShelterResponse = await shelterService.deleteShelter(req.user.id);
        if (deleteShelterResponse instanceof Error){
            return next(deleteShelterResponse);
        }
        return res.status(200).json({
            message: `Shelter was deleted`,
            token: deleteShelterResponse
        });
    }

    async deleteShelterById(req, res, next){
        const {shelterId} = req.params;
        const shelter = await shelterService.getShelterById(shelterId);
        const deleteShelterResponse = await shelterService.deleteShelter(shelter.userId);
        if (deleteShelterResponse instanceof Error){
            return next(deleteShelterResponse);
        }
        return res.status(200).json({
            message: `Shelter was deleted`,
            token: deleteShelterResponse
        });
    }

    async getAllShelters(req, res, next){
        try {
            let {
                limit,
                page,
                shelterName
            } = req.query;

            if (shelterName){
                const targetShelter = await shelterService.getShelterByName(shelterName);
                return res.status(200).json(targetShelter);
            } else {
                limit = limit || 9;
                page = page || 1;
                let offset = page * limit - limit;
                const shelters = await shelterService.getAllShelters()

                const paginatedShelters = pagination.paginateItems(shelters, offset, limit);

                return res.json({
                    shelters: paginatedShelters.paginatedItems,
                    pagination: {
                        totalItems: paginatedShelters.itemCount,
                        totalPages: paginatedShelters.totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                    },
                });
            }
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while getting all shelters ' + error));
        }
    }
}

module.exports = new ShelterController();