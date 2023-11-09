const request = require('supertest');
const {Shelter} = require("../../models/models");
const app = require('../../index').app;
const getToken = require('../../functions/getToken');

class gettingShelterTest{
    getShelterPath = '/api/shelter/'

    async getShelterByNotAuthorizedUser(existedShelter){
        test('Get shelter by not authorized user', async () => {
           const shelter = await Shelter.findOne({where: {shelter_name: existedShelter.shelterName}});

           const response = await request(app)
               .get(this.getShelterPath + shelter.id)
               .expect(401);
           expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    async getShelterByNotDomainUser(existedShelter, notDomainUser){
        test('Get shelter by not domain user', async () => {
           const shelter = await Shelter.findOne({where: {shelter_name: existedShelter.shelterName}});
           const token = await getToken(notDomainUser);

           const response = await request(app)
               .get(this.getShelterPath + shelter.id)
               .set('Authorization', 'Bearer ' + token)
               .expect(403);

           expect(response.body).toHaveProperty('message', 'You do not have access to this shelter');
        });
    }

    async successfulGettingShelter(existedShelter, userInfo){
        test('Successful getting shelter info', async() => {
           const shelter = await Shelter.findOne({where: {shelter_name: existedShelter.shelterName}});
           const token = await getToken(userInfo)
           const response = await request(app)
               .get(this.getShelterPath + shelter.id)
               .set('Authorization', 'Bearer ' + token)
               .expect(200);
           expect(response.body).toHaveProperty('id');
           expect(response.body).toHaveProperty('shelter_name');
           expect(response.body).toHaveProperty('shelter_address');
           expect(response.body).toHaveProperty('shelter_domain');
           expect(response.body).toHaveProperty('shelter_image');
           expect(response.body).toHaveProperty('userId');

           expect(response.body.id).toEqual(shelter.id);
           expect(response.body.shelter_name).toEqual(shelter.shelter_name);
           expect(response.body.shelter_address).toEqual(shelter.shelter_address);
           expect(response.body.shelter_domain).toEqual(shelter.shelter_domain);
           expect(response.body.shelter_image).toEqual(shelter.shelter_image);
           expect(response.body.userId).toEqual(shelter.userId);
        });
    }
}

module.exports = new gettingShelterTest();