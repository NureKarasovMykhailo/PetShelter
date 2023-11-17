const {WorkAnnouncement, User, Shelter} = require('../models/models');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const {Sequelize} = require("sequelize");


class WorkOfferController {

    async create(req, res, next){
        const {workTitle, workDescription, workTelephone,
            workEmail} = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(ApiError.badRequest(errors));
        }

        const workOffer = await WorkAnnouncement.create(
            {
                work_title: workTitle,
                work_description: workDescription,
                work_telephone: workTelephone,
                work_email: workEmail,
                shelterId: req.user.shelterId,
                publish_date: Date.now()
            }
        );

        return res.json({message: workOffer});
    }

    async update(req, res, next){
        const {id} = req.params;
        if (id === null) {
            return next(ApiError.badRequest('Invalid work offer ID'));
        }
        const {workTitle, workDescription, workTelephone,
            workEmail} = req.body;

        const workOffer = await WorkAnnouncement.findOne({where: {id}});
        if (!workOffer) {
            return next(ApiError.badRequest('Invalid work offer ID'));
        }

        const workOfferOwnerUser = await User.findOne({where: {id: req.user.id}});
        if (workOfferOwnerUser.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        workOffer.work_title = workTitle;
        workOffer.work_description = workDescription;
        workOffer.work_telephone = workTelephone;
        workOffer.work_email = workEmail;
        await workOffer.save();
        return res.json({message: workOffer});
    }

    async delete(req, res, next){
        const {id} = req.params;
        if (id === null) {
            return next(ApiError.badRequest('Invalid work offer ID'));
        }
        const workOffer = await WorkAnnouncement.findOne({where: {id}});

        if (!workOffer) {
            return next(ApiError.badRequest('Invalid work offer ID'));
        }

        if (workOffer.shelterId !== req.user.shelterId){
            return next(ApiError.forbidden('You don\'t have an access to information about this shelter'));
        }

        await workOffer.destroy();
        return res.json({message: `Work offer with ID ${id} successfully deleted`});
    }

    async getOne(req, res, next){
        const {id} = req.params;

        if (id === null){
            return next(ApiError.badRequest('Invalid shelter offer ID'));
        }
        const workOffer = await WorkAnnouncement.findOne({where: {id}});
        if (!workOffer){
            return next(ApiError.badRequest(`There no shelter with ID: ${id}`));
        }
        return res.json({message: workOffer});
    }

    async getAll(req, res){
        let {city, country, title, limit, page, sortBy} = req.query;
        let workOffersArr;
        limit = limit || 9;
        page = page || 1;
        let offset = page * limit - limit;
        if (city && country){
            workOffersArr = await WorkAnnouncement.findAll({
                include: [{
                    model: Shelter,
                    where: {
                        [Sequelize.Op.and]: [
                            { shelter_address: { [Sequelize.Op.like]: `%${city}%` } },
                            { shelter_address: { [Sequelize.Op.like]: `%${country}%` } }
                        ]
                    }
                }],

            });
        }

        if (!city && country){
            workOffersArr = await WorkAnnouncement.findAll({
                include: [{
                    model: Shelter,
                    where: {
                        [Sequelize.Op.and]: [
                            { shelter_address: { [Sequelize.Op.like]: `%${country}%` } }
                        ]
                    }
                }],

            });
        }

        if (city && !country){
            workOffersArr = await WorkAnnouncement.findAll({
                include: [{
                    model: Shelter,
                    where: {
                        [Sequelize.Op.and]: [
                            { shelter_address: { [Sequelize.Op.like]: `%${city}%` } }
                        ]
                    }
                }],
            });
        }

        if (!city && !country){
            workOffersArr = await WorkAnnouncement.findAll({
                include: [{
                    model: Shelter
                }],
                limit,
                offset
            });
        }

        if (title){
            let workOffersArrWithTitle = [];
            workOffersArr.map(workOffer => {
                if (workOffer.work_title === title){
                    workOffersArrWithTitle.push(workOffer);
                }
            })
            workOffersArr = workOffersArrWithTitle;
        }

        if (sortBy === 'desc'){
            applicationForAdoption.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else if (sortBy === 'asc'){
            applicationForAdoption.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        }

        let workOffersArrCount = workOffersArr.length;
        let totalPages = Math.ceil(workOffersArrCount / limit);
        let paginatedWorkOffers = workOffersArr.slice(offset, offset + limit);

        return res.json({
            workOffers: paginatedWorkOffers,
            pagination: {
                totalItems: workOffersArrCount,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    }
}

module.exports = new WorkOfferController();