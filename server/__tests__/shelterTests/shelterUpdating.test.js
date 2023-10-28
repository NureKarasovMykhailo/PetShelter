const request = require('supertest');
const path = require("node:path");
const app = require('../../index').app;
const getToken = require('../userTests/userCheckAuth.test');
const {User, Shelter, UserRole} = require('../../models/models');
const bcrypt = require('bcrypt');

const shelterData = {
    "shelterName": "TestShelterForUpdating",
    "shelterCity": "TestCity",
    "shelterStreet": "TestStreet",
    "shelterHouse": "40",
    "shelterDomain": "@test.com",
    "shelterImage": path.resolve(__dirname, '../../static/', 'test-shelter-image.jpg'),
};
const newShelterData = {
    "shelterName": "UpdatedTestShelterFor",
    "shelterCity": "UpdatedTestCity",
    "shelterStreet": "UpdatedTestStreet",
    "shelterHouse": "Updated40",
    "shelterDomain": "@test.ua",
    "shelterImage": '',
};
const existedShelterData = {
    "shelterName": "existedShelterName",
    "shelterCity": "UpdatedTestCity",
    "shelterStreet": "UpdatedTestStreet",
    "shelterHouse": "Updated40",
    "shelterDomain": "@existed.domain",
    "shelterImage": '',
};

const notSubscriberUserData = {
    "login": "notSubscriberTestUser",
    "user_image": "default-user-image.jpg",
    "domain_email": "notSub@test.com",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "12345678",
    "hashed_password": bcrypt.hashSync('ukrainUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
};

const notOwnerUserData = {
    "login": "notOwnerTestUser",
    "user_image": "default-user-image.jpg",
    "domain_email": "notOwner@test.notRight",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "123456789",
    "hashed_password": bcrypt.hashSync('ukrainUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
};

const ownerUserData = {
    "login": "ownerTestUser",
    "user_image": "default-user-image.jpg",
    "domain_email": "owner@test.com",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "1234567890",
    "hashed_password": bcrypt.hashSync('ukrainUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
}

const notSubscriberAuthInfo = {
    "login": "notSubscriberTestUser",
    "password": "ukrainUser24$"
};
const notOwnerAuthInfo = {
    "login": "notOwnerTestUser",
    "password": "ukrainUser24$"
};
const ownerAuthInfo = {
    "login": "ownerTestUser",
    "password": "ukrainUser24$"
};


describe('Shelter updating tests', () => {
    beforeAll(async () => {
        const notSubscriberUser = await User.create(
            {
                login: notSubscriberUserData.login,
                user_image: notSubscriberUserData.user_image,
                domain_email: notSubscriberUserData.domain_email,
                full_name: notSubscriberUserData.full_name,
                birthday: notSubscriberUserData.birthday,
                phone_number: notSubscriberUserData.phone_number,
                hashed_password: notSubscriberUserData.hashed_password,
                date_of_registration: notSubscriberUserData.date_of_registration,
                is_paid: notSubscriberUserData.is_paid
            }
        );
        const notOwnerUser = await User.create(
            {
                login: notOwnerUserData.login,
                user_image: notOwnerUserData.user_image,
                domain_email: notOwnerUserData.domain_email,
                full_name: notOwnerUserData.full_name,
                birthday: notOwnerUserData.birthday,
                phone_number: notOwnerUserData.phone_number,
                hashed_password: notOwnerUserData.hashed_password,
                date_of_registration: notOwnerUserData.date_of_registration,
                is_paid: notOwnerUserData.is_paid
            }
        );
        const ownerUser = await User.create(
            {
                login: ownerUserData.login,
                user_image: ownerUserData.user_image,
                domain_email: ownerUserData.domain_email,
                full_name: ownerUserData.full_name,
                birthday: ownerUserData.birthday,
                phone_number: ownerUserData.phone_number,
                hashed_password: ownerUserData.hashed_password,
                date_of_registration: ownerUserData.date_of_registration,
                is_paid: ownerUserData.is_paid
            }
        );
        const testShelter = await Shelter.create(
            {
                shelter_name: shelterData.shelterName,
                shelter_address: shelterData.shelterCity,
                shelter_domain: shelterData.shelterDomain,
                shelter_image: shelterData.shelterImage
            }
        );
        const existedShelter = await Shelter.create(
            {
                shelter_name: existedShelterData.shelterName,
                shelter_address: existedShelterData.shelterCity,
                shelter_domain: existedShelterData.shelterDomain,
                shelter_image: existedShelterData.shelterImage
            }
        );
        await UserRole.create({userId: notOwnerUser.id, roleId: 1});
        await UserRole.create({userId: ownerUser.id, roleId: 1});
        testShelter.userId = ownerUser.id;
        ownerUser.shelterId = testShelter.id;
        await testShelter.save();
        await ownerUser.save();
    });
    afterAll(async () => {
        await User.destroy({where: {login: ownerUserData.login}});
        await User.destroy({where: {login: notOwnerUserData.login}});
        await User.destroy({where: {login: notSubscriberUserData.login}});
        await Shelter.destroy({where: {shelter_name: shelterData.shelterName}});
        await Shelter.destroy({where: {shelter_name: existedShelterData.shelterName}});
        await Shelter.destroy({where: {shelter_name: newShelterData.shelterName}});
    })

   it('Shelter updating by not authorized user', async () => {
       const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})
       const shelterFullAddress = 'City ' + newShelterData.shelterCity + ' street ' + newShelterData.shelterStreet + ' house ' + newShelterData.shelterHouse
       const response = await request(app)
            .put(`/api/shelter/${shelter.id}`)
            .field('shelterName', newShelterData.shelterName)
            .field('shelterAddress', shelterFullAddress)
            .field('shelterDomain', newShelterData.shelterDomain)
            .attach('shelterImage', newShelterData.shelterImage)
            .expect(401);
       expect(response.body).toHaveProperty('message', 'Non authorized user');
   });
   it('Shelter updating by not subscriber', async() => {
       const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

       const token = await getToken(notSubscriberAuthInfo);
       const shelterFullAddress = 'City ' + newShelterData.shelterCity + ' street ' + newShelterData.shelterStreet + ' house ' + newShelterData.shelterHouse
       const response = await request(app)
           .put(`/api/shelter/${shelter.id}`)
           .set('Authorization', 'Bearer ' + token)
           .field('shelterName', newShelterData.shelterName)
           .field('shelterAddress', shelterFullAddress)
           .field('shelterDomain', newShelterData.shelterDomain)
           .attach('shelterImage', newShelterData.shelterImage)
           .expect(403);
       expect(response.body).toHaveProperty('message', 'Access dined');
   });
   it ('Shelter updating by not owner', async() => {
       const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

       const token = await getToken(notOwnerAuthInfo);
       const shelterFullAddress = 'City ' + newShelterData.shelterCity + ' street ' + newShelterData.shelterStreet + ' house ' + newShelterData.shelterHouse
       const response = await request(app)
           .put(`/api/shelter/${shelter.id}`)
           .set('Authorization', 'Bearer ' + token)
           .field('shelterName', newShelterData.shelterName)
           .field('shelterAddress', shelterFullAddress)
           .field('shelterDomain', newShelterData.shelterDomain)
           .attach('shelterImage', newShelterData.shelterImage)
           .expect(403);
       expect(response.body).toHaveProperty('message', 'You do not have access to this shelter');
   });
   it ('Shelter updating without data', async() => {
       const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

       const token = await getToken(ownerAuthInfo);
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
   it ('Shelter updating with existed domain', async() => {
       const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

       const token = await getToken(ownerAuthInfo);
       const response = await request(app)
           .put(`/api/shelter/${shelter.id}`)
           .set('Authorization', 'Bearer ' + token)
           .field('shelterName', shelterData.shelterName)
           .field('shelterAddress', existedShelterData.shelterCity)
           .field('shelterDomain', existedShelterData.shelterDomain)
           .attach('shelterImage', existedShelterData.shelterImage)
           .expect(400);
       expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');
   });
   it ('Shelter updating with existed name', async() => {
        const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

        const token = await getToken(ownerAuthInfo);
        const response = await request(app)
            .put(`/api/shelter/${shelter.id}`)
            .set('Authorization', 'Bearer ' + token)
            .field('shelterName', existedShelterData.shelterName)
            .field('shelterAddress', existedShelterData.shelterCity)
            .field('shelterDomain', shelterData.shelterDomain)
            .attach('shelterImage', existedShelterData.shelterImage)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');

    });
   it ('Shelter updating with  too big name, not correct city, ' +
        'street, house and domain', async() => {
        const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})

        const token = await getToken(ownerAuthInfo);
        const response = await request(app)
            .put(`/api/shelter/${shelter.id}`)
            .set('Authorization', 'Bearer ' + token)
            .field('shelterName', 'TestNameTestNameTestNameTesTestNameTestNametNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName')
            .field('shelterCity', '123')
            .field('shelterStreet', '123')
            .field('shelterStreet', 'test')
            .field('shelterDomain', 'test')
            .attach('shelterImage', existedShelterData.shelterImage)
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
    it ('Successful shelter updating', async() => {
        const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}})
        const token = await getToken(ownerAuthInfo);
        const response = await request(app)
            .put(`/api/shelter/${shelter.id}`)
            .set('Authorization', 'Bearer ' + token)
            .field('shelterName', newShelterData.shelterName)
            .field('shelterCity', newShelterData.shelterCity)
            .field('shelterStreet', newShelterData.shelterStreet)
            .field('shelterHouse', newShelterData.shelterHouse)
            .field('shelterDomain', newShelterData.shelterDomain)
            .attach('shelterImage', '')
            .expect(200);

        const updatedShelter = await Shelter.findOne({where: {shelter_name: newShelterData.shelterName}})
        expect(updatedShelter.shelter_name).toEqual(newShelterData.shelterName);
        expect(updatedShelter.shelter_address).toEqual('City ' + newShelterData.shelterCity + ' street ' + newShelterData.shelterStreet + ' house ' + newShelterData.shelterHouse);
        expect(updatedShelter.domain).toEqual(newShelterData.domain);
    });
});