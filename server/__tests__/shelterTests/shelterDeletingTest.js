const request = require('supertest');
const {Shelter} = require("../../models/models");
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {INTEGER} = require("sequelize");
const {raw} = require("express");


class shelterDeletingTest {
    shelterDeletingPath = '/api/shelter/';
    async deletingByNotAuthorizedUser(existingShelter){
        test('Deleting by not authorized user', async () => {
            const shelter = await Shelter.findOne({where: {shelter_name: existingShelter.shelterName}});

            const response = await request(app)
                .delete(this.shelterDeletingPath + shelter.id)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async deletingByNotSubscriber(existingShelter, notSubscriberAuthData){
        test('Deleting by not subscriber', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: existingShelter.shelterName}});
            const token = await getToken(notSubscriberAuthData);

            const response = await request(app)
                .delete(this.shelterDeletingPath + shelter.id)
                .set('Authorization', 'Bearer ' + token)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    async deletingByNotShelterOwner(existingShelter, notOwnerAuthData){
        test('Deleting by not shelter owner', async() => {
           const shelter = await Shelter.findOne({where: {shelter_name: existingShelter.shelterName}});
           const token = await getToken(notOwnerAuthData);

           const response = await request(app)
               .delete(this.shelterDeletingPath + shelter.id)
               .set('Authorization', 'Bearer ' + token)
               .expect(403);
           expect(response.body).toHaveProperty('message', 'You do not have access to this shelter');
        });
    }

    async successfulDeleting(existingShelter, subscriberAuth){
        test('Success shelter deleting', async() => {
           const shelter = await Shelter.findOne({where: {shelter_name: existingShelter.shelterName}});
           const token = await getToken(subscriberAuth);

           const response = await request(app)
               .delete(this.shelterDeletingPath + shelter.id)
               .set('Authorization', 'Bearer ' + token)
               .expect(200);
           expect(response.body).toHaveProperty('message', 'Shelter successfully deleted');
           const deletedShelter = await Shelter.findOne({where: {shelter_name: existingShelter.shelterName}});
           expect(deletedShelter).toBeNull();
        });
    }
}

module.exports = new shelterDeletingTest();