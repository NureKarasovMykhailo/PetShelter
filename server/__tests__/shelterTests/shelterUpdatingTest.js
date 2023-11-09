const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {User, Shelter} = require('../../models/models');

class shelterUpdatingTest {

    async updatingByNotAuthorizedUser(updateShelterData, shelterData){
        it('Shelter updating by not authorized user', async () => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})
            const shelterFullAddress = 'City ' + updateShelterData.shelterCity + ' street ' + updateShelterData.shelterStreet + ' house ' + updateShelterData.shelterHouse
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .field('shelterName', updateShelterData.shelterName)
                .field('shelterAddress', shelterFullAddress)
                .field('shelterDomain', updateShelterData.shelterDomain)
                .attach('shelterImage', updateShelterData.shelterImage)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async updatingByNotSubscriber(notSubscriberAuthInfo, shelterForUpdating, updatingInfo){
        it('Shelter updating by not subscriber', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(notSubscriberAuthInfo);
            const shelterFullAddress = 'City ' + updatingInfo.shelterCity + ' street ' + updatingInfo.shelterStreet + ' house ' + updatingInfo.shelterHouse
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', updatingInfo.shelterName)
                .field('shelterAddress', shelterFullAddress)
                .field('shelterDomain', updatingInfo.shelterDomain)
                .attach('shelterImage', updatingInfo.shelterImage)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    async updatingBoNotOwner(shelterForUpdating, subscriberWithShelterAuthData, updatingData){
        it ('Shelter updating by not owner', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(subscriberWithShelterAuthData);
            const shelterFullAddress = 'City ' + updatingData.shelterCity + ' street ' + updatingData.shelterStreet + ' house ' + updatingData.shelterHouse
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', updatingData.shelterName)
                .field('shelterAddress', shelterFullAddress)
                .field('shelterDomain', updatingData.shelterDomain)
                .attach('shelterImage', updatingData.shelterImage)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'You do not have access to this shelter');
        });
    }

    async updatingWithOutData(shelterForUpdating, subscriberForUpdating){
        it ('Shelter updating without data', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(subscriberForUpdating);
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', '')
                .field('shelterAddress', '')
                .field('shelterDomain', '')
                .attach('shelterImage', '')
                .expect(400);
            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;
            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter name of your shelter",
                    "path": "shelterName",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter the address of your shelter",
                    "path": "shelterCity",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter domain of your shelter",
                    "path": "shelterDomain",
                    "location": "body"
                }
            ]));
        });
    }

    async withExistedDomain(subscriberForUpdating, shelterForUpdating, existedShelter, updatingData){
        it ('Shelter updating with existed domain', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(subscriberForUpdating);
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', updatingData.shelterName)
                .field('shelterCity', updatingData.shelterCity)
                .field('shelterStreet', updatingData.shelterStreet)
                .field('shelterHouse', updatingData.shelterHouse)
                .field('shelterDomain', existedShelter.shelterDomain)
                .attach('shelterImage', updatingData.shelterImage)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');
        });
    }

    async withExistedName(subscriberForUpdating, shelterForUpdating, existedShelter, updatingData){
        it ('Shelter updating with existed name', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(subscriberForUpdating);
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', existedShelter.shelterName)
                .field('shelterCity', updatingData.shelterCity)
                .field('shelterStreet', updatingData.shelterStreet)
                .field('shelterHouse', updatingData.shelterHouse)
                .field('shelterDomain', updatingData.shelterDomain)
                .attach('shelterImage', '')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');

        });
    }

    async withInvalidData(subscriberForUpdating, shelterForUpdating){
        it ('Shelter updating with  too big name, not correct city, ' +
            'street, house and domain', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})

            const token = await getToken(subscriberForUpdating);
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', 'TestNameTestNameTestNameTesTestNameTestNametNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName')
                .field('shelterCity', '123')
                .field('shelterStreet', '123')
                .field('shelterStreet', 'test')
                .field('shelterDomain', 'test')
                .attach('shelterImage', shelterForUpdating.shelterImage)
                .expect(400);
            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;
            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "TestNameTestNameTestNameTesTestNameTestNametNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName",
                    "msg": "Name of shelter must be from 5 to 100 symbols",
                    "path": "shelterName",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "123",
                    "msg": "Please enter correct address of your shelter",
                    "path": "shelterCity",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "123",
                    "msg": "Please enter correct address of your shelter",
                    "path": "shelterStreet",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "test",
                    "msg": "Your domain should be something like: @example.com",
                    "path": "shelterDomain",
                    "location": "body"
                }
            ]));
        });
    }

    async successfulUpdating(subscriberForUpdating, shelterForUpdating, shelterUpdatingData){
        it ('Successful shelter updating', async() => {
            const shelter = await Shelter.findOne({where: {shelter_name: shelterForUpdating.shelterName}})
            const token = await getToken(subscriberForUpdating);
            const response = await request(app)
                .put(`/api/shelter/${shelter.id}`)
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', shelterUpdatingData.shelterName)
                .field('shelterCity', shelterUpdatingData.shelterCity)
                .field('shelterStreet', shelterUpdatingData.shelterStreet)
                .field('shelterHouse', shelterUpdatingData.shelterHouse)
                .field('shelterDomain', shelterUpdatingData.shelterDomain)
                .attach('shelterImage', '')
                .expect(200);

            const updatedShelter = await Shelter.findOne({where: {shelter_name: shelterUpdatingData.shelterName}})
            expect(updatedShelter.shelter_name).toEqual(shelterUpdatingData.shelterName);
            expect(updatedShelter.shelter_address).toEqual('City ' + shelterUpdatingData.shelterCity + ' street ' + shelterUpdatingData.shelterStreet + ' house ' + shelterUpdatingData.shelterHouse);
            expect(updatedShelter.domain).toEqual(shelterUpdatingData.domain);
        });
    }
}

module.exports = new shelterUpdatingTest();