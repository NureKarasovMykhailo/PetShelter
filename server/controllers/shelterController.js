<<<<<<< HEAD
const {Shelter, User} = require('../models/models');
const {Sequelize} = require("sequelize");
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const {validationResult} = require('express-validator')
const path = require("path");
const deleteImageFromStatic = require('../functions/deleteImage');
const fs = require("node:fs");

const isShelterExistChecking = async (shelterName, shelterDomain) => {
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

const checkNewShelterName = async (newName) => {
    const shelter = await Shelter.findOne({where: {shelter_name: newName}});
    if (shelter) {
        return false;
    }
    return true;
};

const checkNewDomain = async (newDomain) => {
    const shelter = await Shelter.findOne({where: {shelter_domain: newDomain}});
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
    let shelterUsers = await User.findAll({where: {shelterId}});
    const regex = new RegExp(`${oldDomain}\\b`, 'g');
    await Promise.all(shelterUsers.map(async shelterUser => {
        let domainEmail = shelterUser.domain_email;
        shelterUser.domain_email = domainEmail.replace(regex, `${newDomain}`);
        await shelterUser.save();
    }));
}


=======
>>>>>>> origin/main
class ShelterController {

    async create(req, res, next) {
        const {
            shelterName,
<<<<<<< HEAD
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
            const shelter = await Shelter.create(
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
        } catch (e) {
            return next(ApiError.internal('Server error while creating new shelter'));
        }
        if (shelterImageName !== 'default-shelter-image.jpg') {
            await shelterImage.mv(path.resolve(__dirname, '..', 'static', shelterImageName));
        }
        return res.json({message: 'Shelter successfully created'});
    }

    async get(req, res, next) {
        const {id} = req.params;
        try {
            const shelter = await Shelter.findOne({where: {id}});
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
            let shelter = await Shelter.findOne({where: {id: id}});
            let userId = req.user.id;
            let user = await User.findOne({where: {id: userId}});
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
            return res.json(shelter);
        } catch (e) {
            return next(ApiError.internal('Server error while updating shelter'));
        }
    }

    async delete(req, res, next){
        const {id} = req.params;
        try {
            const shelter = await Shelter.findOne({where: {id}});
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
            await shelter.destroy();
            //TODO add deleting of ALL information releated to the shelter
            return res.json({message: 'Shelter successfully deleted'});
        } catch (e) {
            return next(ApiError.internal('Server error while deleting shelter'));
        }
    }
=======
            shelterAddress,
            shelterDomain,
        } = req.body;
        const {shelterImage} = req.files;


    }

    async get(req, res, next) {

    }

    async update(req, res, next) {

    }

    async delete(req, res, next){

    }


>>>>>>> origin/main
}

module.exports = new ShelterController();