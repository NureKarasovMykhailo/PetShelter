const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const {User, Shelter} = require('../../models/models');


class shelterCreatingTest {
    async creatingByNotSubscriber(notSubscriberUserAuthData, addedShelterData) {
        it('Shelter creating by not subscriber', async() => {
            const token = await getToken(notSubscriberUserAuthData);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .send(addedShelterData)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    async creatingByUserWithShelter(userWithShelterAuthData, addedShelterData){
        it('Shelter creating by user who has already shelter', async () => {
            const token = await getToken(userWithShelterAuthData);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .send(addedShelterData)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'You already have registered shelter');
        });
    }

    async creatingWithInvalidToken(addedShelterData){
        it('Shelter creating with invalid token', async () => {
            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer invalidToken')
                .send(addedShelterData)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async creatingWithOutToken(addedShelterData){
        it('Shelter creating without authorization token', async() => {
            const response = await request(app)
                .post('/api/shelter/')
                .send(addedShelterData)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async creatingWithOutData(subscriberWithOutShelter){
        it('Shelter creating without data', async() => {
            const token =  await getToken(subscriberWithOutShelter);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', '')
                .field('shelterCity', '')
                .field('shelterStreet', '')
                .field('shelterHouse', '')
                .field('shelterDomain', '')
                .field('shelterImage', '')
                .field('subscriberDomainEmail', '')
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
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter your domain email",
                    "path": "subscriberDomainEmail",
                    "location": "body"
                },
            ]));
        });
    }

    async creatingWithInvalidData(subscriberWithOutShelter){
        it('Shelter creating with too big name length, not correct city ' +
            'street house and domain', async () => {
            const token = await getToken(subscriberWithOutShelter);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', 'TestNameTestNameTestNameTestTestNameTestNameNameTestNameTestName' +
                    'TestNameTestNameTestNameTestNameTestNameTestName')
                .field('shelterCity', '123')
                .field('shelterStreet', '123')
                .field('shelterHouse', 'test')
                .field('shelterDomain', 'test')
                .field('shelterImage', '')
                .field('subscriberDomainEmail', '123213іфв')
                .expect(400);

            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;

            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "TestNameTestNameTestNameTestTestNameTestNameNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName",
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
                },
                {
                    "type": "field",
                    "value": "123213іфв",
                    "msg": "Please enter correct domain email",
                    "path": "subscriberDomainEmail",
                    "location": "body"
                }
            ]));
        });
    }

    async creatingWithExistedData(subscriberWithOutShelter, existedShelterData){
        it('Shelter creating with existing data', async () => {
            const token = await getToken(subscriberWithOutShelter);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .field('shelterName', existedShelterData.shelterName)
                .field('shelterCity', existedShelterData.shelterCity)
                .field('shelterStreet', existedShelterData.shelterStreet)
                .field('shelterHouse', existedShelterData.shelterHouse)
                .field('shelterDomain', existedShelterData.shelterDomain)
                .field('subscriberDomainEmail', existedShelterData.subscriberDomainEmail)
                .field('shelterImage', '')
                .expect(400);
            expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');
        });
    }

    async successfulCreating(subscriberWithOutShelter, addedShelterData){
        it('Successful shelter creating', async () => {
            const token = await getToken(subscriberWithOutShelter);

            const response = await request(app)
                .post('/api/shelter/')
                .set('Authorization', 'Bearer ' + token)
                .attach('shelterImage', addedShelterData.shelterImage)
                .field('shelterName', addedShelterData.shelterName)
                .field('shelterCity', addedShelterData.shelterCity)
                .field('shelterStreet', addedShelterData.shelterStreet)
                .field('shelterHouse', addedShelterData.shelterHouse)
                .field('shelterDomain', addedShelterData.shelterDomain)
                .field('subscriberDomainEmail', addedShelterData.subscriberDomainEmail)
                .expect(200)
            expect(response.body).toHaveProperty('message', 'Shelter successfully created');

            const shelter = await Shelter.findOne({where: {shelter_name: addedShelterData.shelterName}});
            const shelterOwner = await User.findOne({where: {shelterId: shelter.id}});
            expect(shelter.shelter_name).toEqual(addedShelterData.shelterName);
            expect(shelter.shelter_address).toEqual('City ' + addedShelterData.shelterCity + ' street ' + addedShelterData.shelterStreet + ' house ' + addedShelterData.shelterHouse);
            expect(shelter.shelter_domain).toEqual(addedShelterData.shelterDomain);
            expect(shelter.userId).toBe(shelterOwner.id);
            expect(shelterOwner.domain_email).toEqual(addedShelterData.subscriberDomainEmail + addedShelterData.shelterDomain);
            expect(shelter.shelter_image).toBeDefined();
        });
    }

}

module.exports = new shelterCreatingTest();