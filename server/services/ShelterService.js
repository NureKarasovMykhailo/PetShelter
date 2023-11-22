const {Shelter, User} = require("../models/models");
const {Sequelize} = require("sequelize");
const models = require("../models/models");
const uuid = require("uuid");
const path = require("node:path");
const fs = require("node:fs");
const ApiError = require("../error/ApiError");
const getUserRoles = require("../middleware/getUserRoles");
const generateJWT = require("../functions/generateJwt");
const applicationForAdoptionService = require("../services/ApplicationForAdoptionService");
const employeeService = require("../services/EmployeeService");
const feederInfoService = require("../services/FeederInfoService");
const feederService = require("../services/FeederService");
const petAdoptionOfferService = require("../services/PetAdoptionOfferService");
const petService = require("../services/PetService");
const workOfferService = require("../services/WorkOfferService");

class ShelterService {
    async isShelterExistChecking(shelterName, shelterDomain){
        const existedShelter = await Shelter.findOne({
            where: {
                [Sequelize.Op.or] : [
                    {shelter_name: shelterName},
                    {shelter_domain: shelterDomain}
                ]
            }
        });
        if (existedShelter === null) {
            return false;
        } else {
            return true;
        }
    }

    async createShelter({
        shelterName,
        shelterFullAddress,
        shelterDomain,
        shelterImageName,
        userId
    }){
        return await Shelter.create({
            shelter_name: shelterName,
            shelter_address: shelterFullAddress,
            shelter_domain: shelterDomain,
            shelter_image: shelterImageName,
            userId: userId,
        });
    }

    async getShelterById(shelterId){
        return await models.Shelter.findOne({where: {id: shelterId}});
    }

    async isShelterNameExist(shelterName){
        const shelter = await models.Shelter.findOne({where: {shelter_name: shelterName}});
        if (shelter) {
            return false;
        }
        return true;
    }

    async isShelterDomainExist(shelterDomain){
        const shelter = await models.Shelter.findOne({where: {shelter_domain: shelterDomain}});
        if (shelter) {
            return false;
        }
        return true;
    }

    async updateShelter(shelter, {
        newShelterName,
        newShelterDomain,
        newShelterAddress
    }){
        shelter.shelter_name = newShelterName;
        shelter.shelter_domain = newShelterDomain;
        shelter.shelter_address = newShelterAddress;
        shelter.save();
        return shelter;
    }

    async changeShelterImage(shelterImage, shelter){
        const shelterImageName = uuid.v4() + '.jpg';
        await shelterImage.mv(path.resolve(__dirname, '..', 'static', shelterImageName));
        if (shelter.shelter_image !== 'default-shelter-image.jpg') {
            fs.unlink(
                path.resolve(__dirname, '../static/', shelter.shelter_image),
                () => console.log('Shelter image was deleted')
            );
        }
        shelter.shelter_image = shelterImageName;
        shelter.save();
        return shelter;
    }

    async deleteShelter(shelterOwnerId){
        try {
            const shelterOwner = await User.findOne({where: {id: shelterOwnerId}});
            const shelter = await Shelter.findOne({where: {id: shelterOwner.shelterId}});
            if (shelterOwner.shelterId !== shelter.id) {
                return ApiError.forbidden('You do not have access to this shelter');
            }
            if (shelter.shelter_image !== 'default-shelter-image.jpg') {
                fs.unlink(
                    path.resolve(__dirname, '../static/', shelter.shelter_image),
                    () => console.log('Shelter image was deleted')
                );
            }

            await applicationForAdoptionService.deleteAllShelterApplicationForAdoption(shelter.id);
            await petAdoptionOfferService.deleteAllShelterAdoptionOffers(shelter.id);
            await petService.deleteAllShelterPetsCharacteristics(shelter.id);
            await petService.deleteAllShelterPets(shelter.id);
            await workOfferService.deleteAllWorkOffers(shelter.id);
            await feederInfoService.deleteAllShelterFeedersInfo(shelter.id);
            await feederService.deleteAllShelterFeeders(shelter.id);
            await employeeService.deleteAllShelterEmployee(shelter.id, shelterOwner.id);

            await shelter.destroy();
            const shelterOwnerUpdated = await models.User.findOne({where: {id: shelterOwner.id}});
            shelterOwnerUpdated.shelterId = null;
            shelterOwnerUpdated.domain_email = null;
            await shelterOwnerUpdated.save();
            const roles = await getUserRoles(shelterOwnerUpdated);
            return await generateJWT(
                shelterOwnerUpdated.id,
                shelterOwnerUpdated.login,
                shelterOwnerUpdated.user_image,
                shelterOwnerUpdated.domain_email,
                shelterOwnerUpdated.email,
                shelterOwnerUpdated.full_name,
                shelterOwnerUpdated.birthday,
                shelterOwnerUpdated.phone_number,
                shelterOwnerUpdated.is_paid,
                shelterOwnerUpdated.shelterId,
                roles,
            );
        } catch (error) {
            console.log(error);
            return ApiError.internal('Server error while deleting shelter ' + error);
        }

    }

    async getShelterByName(shelterName){
        return await Shelter.findOne({
            where: {shelter_name: shelterName}
        });
    }

    async getAllShelters () {
        return await Shelter.findAll();
    }
}

module.exports = new ShelterService();