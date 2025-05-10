const {WorkAnnouncement, Shelter} = require("../models/models");
const {Sequelize} = require("sequelize");
const models = require("../models/models");

class WorkOfferService {

    async createWorkOffer({
        workTitle,
        workDescription,
        workTelephone,
        workEmail,
        shelterId
    }){
        return await WorkAnnouncement.create(
            {
                work_title: workTitle,
                work_description: workDescription,
                work_telephone: workTelephone,
                work_email: workEmail,
                shelterId: shelterId,
                publish_date: Date.now()
            }
        );
    }

    async getWorkOfferById(workOfferId){
        return await WorkAnnouncement.findOne({where: {id: workOfferId}})
    }

    async updateWorkOffer(workOffer, {
        workTitle,
        workDescription,
        workTelephone,
        workEmail
    }) {
        workOffer.work_title = workTitle;
        workOffer.work_description = workDescription;
        workOffer.work_telephone = workTelephone;
        workOffer.work_email = workEmail;
        await workOffer.save();
        return workOffer;
    }

    async getWorkOfferByCityAndCountry(workOffers, city, country){
        if (city && country){
            workOffers = await WorkAnnouncement.findAll({
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
            workOffers = await WorkAnnouncement.findAll({
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
            workOffers = await WorkAnnouncement.findAll({
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
            workOffers = await WorkAnnouncement.findAll({
                include: [{
                    model: Shelter
                }]
            });
        }

        return workOffers;
    }

    async filterWorkOffersByTitle(workOffers, title){
        let workOffersArrWithTitle = [];
        workOffers.map(workOffer => {
            if (workOffer.work_title === title){
                workOffersArrWithTitle.push(workOffer);
            }
        })
        workOffers = workOffersArrWithTitle;
        return workOffers;
    }

    sortWorkOffers(workOffers, sortBy){
        if (sortBy === 'desc'){
            workOffers.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else if (sortBy === 'asc'){
            workOffers.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
        }
    }

    async deleteAllWorkOffers (shelterId)  {
        await models.WorkAnnouncement.destroy({
            where: {shelterId}
        });
    }
}

module.exports = new WorkOfferService();