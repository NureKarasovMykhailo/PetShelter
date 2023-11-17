const models = require('../models/models')
const {Sequelize} = require("sequelize");
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const {validationResult} = require('express-validator')
const path = require("path");
const fs = require("node:fs");
const generateJWT = require('../functions/generateJWT');
const getUserRoles = require('../middleware/getUserRoles');
const {Transaction} = require('sequelize')
const {Feeder} = require("../models/models");

const isShelterExistChecking = async (shelterName, shelterDomain) => {
    const existedShelter = await models.Shelter.findOne({
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

const checkNewShelterName = async (newName) => {
    const shelter = await models.Shelter.findOne({where: {shelter_name: newName}});
    if (shelter) {
        return false;
    }
    return true;
};

const checkNewDomain = async (newDomain) => {
    const shelter = await models.Shelter.findOne({where: {shelter_domain: newDomain}});
    if (shelter) {
        return false;
    }
    return true;
};

const checkUserDomain =  (user, shelter) => {
    if (user.domain_email === null) {
        return false;
    }
    return user.domain_email.includes(shelter.shelter_domain);
};

const changeUsersDomain = async (shelterId, oldDomain, newDomain) => {
    let shelterUsers = await models.User.findAll({where: {shelterId}});
    const regex = new RegExp(`${oldDomain}\\b`, 'g');
    await Promise.all(shelterUsers.map(async shelterUser => {
        let domainEmail = shelterUser.domain_email;
        shelterUser.domain_email = domainEmail.replace(regex, `${newDomain}`);
        await shelterUser.save();
    }));
}

const deleteAllShelterUsers = async (shelterId, shelterOwnerId) => {
    const shelterEmployees = await models.User.findAll({
        where: {
            shelterId,
            id: {
                [Sequelize.Op.not]: shelterOwnerId
            }
        },
    });
    await Promise.all(shelterEmployees.map(async shelterEmployee => {
        if (shelterEmployee.user_image !== 'default-user-image.jpg'){
            await fs.unlink(
                path.resolve(__dirname, '..', '..static', shelterEmployee.user_image),
                () => {console.log(`Image: ${shelterEmployee.user_image} was deleted`)}
            );
        }
        await shelterEmployee.destroy();
    }));
}

const deleteAllWorkOffers = async (shelterId) => {
    await models.WorkAnnouncement.destroy({
        where: {shelterId}
    });
}

const deleteAllPetsCharacteristics = async (shelterId) => {
    const petsArr = await models.Pet.findAll({
        where: {shelterId}
    });
    await Promise.all(petsArr.map(async pet => {
        await models.PetCharacteristic.destroy({
           where: {petId: pet.id}
        });
    }));
}

const deleteAllPets = async (shelterId) => {
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

const deleteAllFeedersInfo = async (shelterId) => {
    const feedersOfShelter = await models.Feeder.findAll({
        where: {shelterId}
    });
    await Promise.all(feedersOfShelter.map(async feeder => {
        await models.FeederInfo.destroy({
            where: {feederId: feeder.id}
        });
    }));
}

const deleteAllFeeders = async (shelterId) => {
    await models.Feeder.destroy({
        where: {shelterId}
    });
}

const deleteAllApplicationForAdoption = async (shelterId) => {
    const adoptionOffers = await models.AdoptionAnnouncement.findAll({
        include: [{
            model: models.Pet,
            attributes: [],
            where: {shelterId}
        }]
    });
    await Promise.all(adoptionOffers.map(async adoptionOffer => {
        await models.ApplicationForAdoption.destroy({
            where: {adoptionAnnouncementId: adoptionOffer.id}
        })
    }));
}

const deleteAllAdoptionOffers = async (shelterId) => {
    const adoptionOffers = await models.AdoptionAnnouncement.findAll({
        include: [{
            model: models.Pet,
            attributes: [],
            where: {shelterId}
        }]
    });
    await Promise.all(adoptionOffers.map(async adoptionOffer => {
        await adoptionOffer.destroy()
    }));
}

class ShelterController {

    async create(req, res, next) {
        const {
            shelterName,
            shelterCity,
            shelterStreet,
            shelterHouse,
            shelterDomain,
            subscriberDomainEmail
        } = req.body;
        let shelterImage;
        let shelterImageName;
        console.log('Starting creating')

        if (!req.files || Object.keys(req.files).length === 0) {
            shelterImageName = 'default-shelter-image.jpg';
        } else {
            shelterImage = req.files.shelterImage;
            shelterImageName = uuid.v4() + '.jpg';
        }
        let isShelterExist = false;
        isShelterExist = await isShelterExistChecking(shelterName, shelterDomain);
        if (isShelterExist) {
            return next(ApiError.badRequest('Shelter with this data already exists'));
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.badRequest(errors));
        }
        const shelterFullAddress = 'City ' + shelterCity + ' street '
            + shelterStreet + ' house ' + shelterHouse;
        try {
            const shelter = await models.Shelter.create(
                {
                    shelter_name: shelterName,
                    shelter_address: shelterFullAddress,
                    shelter_domain: shelterDomain,
                    shelter_image: shelterImageName,
                    userId: req.user.id
                }
            );
            const user = await User.findOne({where: {id: req.user.id}})
            user.domain_email = subscriberDomainEmail + shelterDomain;
            user.shelterId = shelter.id;
            await user.save();
            const roles = await getUserRoles(user);
            const newToken = await generateJWT(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId,
                roles,
            );
            if (shelterImageName !== 'default-shelter-image.jpg') {
                await shelterImage.mv(path.resolve(__dirname, '..', 'static', shelterImageName));
            }
            return res.json({message: shelter, token: newToken});

        } catch (e) {
            return next(ApiError.internal('Server error while creating new shelter'));
        }
    }

    async get(req, res, next) {
        const {id} = req.params;
        try {
            const shelter = await models.Shelter.findOne({where: {id}});
            const user = req.user;
            const hasAccess = checkUserDomain(user, shelter);
            if (!hasAccess) {
                return next(ApiError.forbidden('You do not have access to this shelter'));
            }
            return res.json(shelter);
        } catch (e) {
            return next(ApiError.internal('Server error while getting shelter\'s info'));
        }
    }

    async update(req, res, next) {
        const {id} = req.params;
        const {
            shelterName,
            shelterCity,
            shelterStreet,
            shelterHouse,
            shelterDomain
        } = req.body;
        let shelterImage = null;
        if (req.files !== null) {
            shelterImage = req.files.shelterImage;
        }

        try {
            let shelter = await models.Shelter.findOne({where: {id: id}});
            let userId = req.user.id;
            let user = await models.User.findOne({where: {id: userId}});
            const hasAccess = checkUserDomain(user, shelter);
            if (!hasAccess) {
                return next(ApiError.forbidden('You do not have access to this shelter'));
            }
            if (shelterName !== shelter.shelter_name) {
                const isValidNewName = await checkNewShelterName(shelterName);
                if (!isValidNewName) {
                    return next(ApiError.badRequest('Shelter with this data already exists'));
                }
            }
            if (shelterDomain !== shelter.shelter_domain) {
                const isValidDomain = await checkNewDomain(shelterDomain);
                if (!isValidDomain) {
                    return next(ApiError.badRequest('Shelter with this data already exists'));
                }
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }
            const shelterFullAddress = 'City ' + shelterCity + ' street ' + shelterStreet + ' house ' + shelterHouse;
            shelter.shelter_name = shelterName;
            await changeUsersDomain(shelter.id, shelter.shelter_domain, shelterDomain);
            shelter.shelter_domain = shelterDomain;
            shelter.shelter_address = shelterFullAddress;
            if (shelterImage !== null) {
                const shelterImageName = uuid.v4() + '.jpg';
                await shelterImage.mv(path.resolve(__dirname, '..', 'static', shelterImageName));
                if (shelter.shelter_image !== 'default-shelter-image.jpg') {
                    fs.unlink(
                        path.resolve(__dirname, '../static/', shelter.shelter_image),
                        () => console.log('Shelter image was deleted')
                    );
                }
                shelter.shelter_image = shelterImageName;
            }
            await shelter.save();
            await user.save();
            const roles = await getUserRoles(user);
            const newToken = await generateJWT(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId,
                roles,
            );
            return res.json({message: shelter, token: newToken});
        } catch (e) {
            return next(ApiError.internal('Server error while updating shelter'));
        }
    }

    async delete(req, res, next){
        const {id} = req.params;
        try {
            const shelter = await models.Shelter.findOne({where: {id}});
            const user = req.user;
            const hasAccess = checkUserDomain(user, shelter);
            if (!hasAccess) {
                return next(ApiError.forbidden('You do not have access to this shelter'));
            }
            if (shelter.shelter_image !== 'default-shelter-image.jpg') {
                fs.unlink(
                    path.resolve(__dirname, '../static/', shelter.shelter_image),
                    () => console.log('Shelter image was deleted')
                );
            }

            await deleteAllApplicationForAdoption(id);
            await deleteAllAdoptionOffers(id);
            await deleteAllPetsCharacteristics(id);
            await deleteAllPets(id);
            await deleteAllWorkOffers(id);
            await deleteAllFeedersInfo(id);
            await deleteAllFeeders(id);
            await deleteAllShelterUsers(id, req.user.id);

            await shelter.destroy();
            const shelterOwner = await models.User.findOne({where: {id: req.user.id}});
            shelterOwner.shelterId = null;
            await shelterOwner.save();
            const roles = await getUserRoles(shelterOwner);
            const newToken = await generateJWT(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId,
                roles,
            );
            return res.json({message: 'Shelter successfully deleted', token: newToken});
        } catch (e) {
            console.log(e);
            return next(ApiError.internal('Server error while deleting shelter'));
        }
    }
}

module.exports = new ShelterController();