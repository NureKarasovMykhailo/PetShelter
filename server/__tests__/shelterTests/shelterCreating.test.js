const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const path = require('node:path');
const fs = require('node:fs');
const {User, Shelter, UserRole} = require('../../models/models');
const bcrypt = require("bcrypt");

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

const userWhoHasShelterData = {
    "login": "useWhoHasShelter",
    "user_image": "default-user-image.jpg",
    "domain_email": "useWhoHasShelterr@lapki.org",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "123456789",
    "hashed_password": bcrypt.hashSync('ukrainUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
};

const validUserData = {
    "login": "validTestUser",
    "user_image": "default-user-image.jpg",
    "domain_email": "",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "1234567890",
    "hashed_password": bcrypt.hashSync('ukrainUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
}

const notSubscriberUserAuthData = {
    "login": "notSubscriberTestUser",
    "password": "ukrainUser24$"
};


const userWhoHasAlreadyShelterAuthData = {
    "login": "useWhoHasShelter",
    "password": "ukrainUser24$"
};

const validUserAuthData = {
    "login": "validTestUser",
    "password": "ukrainUser24$"
};

const validShelterData = {
    "shelterName": "TestName",
    "shelterAddress": "City Київ street Героїв України house 70",
    "shelterCity": "Харків",
    "shelterStreet": "Французький Бульвар",
    "shelterHouse": "70",
    "shelterDomain": "@test.com",
    "shelterImage": "",
    "subscriberDomainEmail": "sub"
};

const existingShelterData = {
    "shelterName": "Лапки",
    "shelterAddress": "City Київ street Героїв України house 70",
    "shelterCity": "Київ",
    "shelterStreet": "Героїв України",
    "shelterHouse": "70",
    "shelterDomain": "@lapki.org",
    "shelterImage": "",
    "subscriberDomainEmail": "jain"
};

const deleteShelterImage = (shelter) => {
    let shelterImageName = shelter.shelter_image;
    fs.unlink(
        path.resolve(__dirname, '../../static/', shelterImageName),
        (err
        ) => {
            if (err) {
                console.error(`Error while deleting file: ${err}`);
            } else {
                console.log(`File ${path} successfully deleted`);
            }
        });
};

describe('Shelter creating tests', () => {

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
        const userWithShelter = await User.create(
            {
                login: userWhoHasShelterData.login,
                user_image: userWhoHasShelterData.user_image,
                domain_email: userWhoHasShelterData.domain_email,
                full_name: userWhoHasShelterData.full_name,
                birthday: userWhoHasShelterData.birthday,
                phone_number: userWhoHasShelterData.phone_number,
                hashed_password: userWhoHasShelterData.hashed_password,
                date_of_registration: userWhoHasShelterData.date_of_registration,
                is_paid: userWhoHasShelterData.is_paid
            }
        );
        const validUser = await User.create(
            {
                login: validUserData.login,
                user_image: validUserData.user_image,
                domain_email: validUserData.domain_email,
                full_name: validUserData.full_name,
                birthday: validUserData.birthday,
                phone_number: validUserData.phone_number,
                hashed_password: validUserData.hashed_password,
                date_of_registration: validUserData.date_of_registration,
                is_paid: validUserData.is_paid
            }
        );
        await UserRole.create({userId: userWithShelter.id, roleId: 1});
        await UserRole.create({userId: validUser.id, roleId: 1});
        await UserRole.create({userId: notSubscriberUser.id, roleId: 2});
        const existedShelter = await Shelter.create(
            {
                shelter_name: existingShelterData.shelterName,
                shelter_address: existingShelterData.shelterAddress,
                shelter_domain: existingShelterData.shelterDomain,
                shelter_image: existingShelterData.shelterImage,
                userId: userWithShelter.id
            }
        );
        userWithShelter.shelterId = existedShelter.id;
        await userWithShelter.save();
    });

    afterAll(async() => {
        const shelter = await Shelter.findOne({where: {shelter_name: validShelterData.shelterName}});
        if (shelter) {
            deleteShelterImage(shelter);
        }
        await User.destroy({where: {login: notSubscriberUserData.login}});
        await User.destroy({where: {login: userWhoHasShelterData.login}});
        await User.destroy({where: {login: validUserData.login}});
        await Shelter.destroy({where: {shelter_name: existingShelterData.shelterName}});
        await Shelter.destroy({where: {shelter_name: validShelterData.shelterName}});
    });

    it('Shelter creating by not subscriber', async() => {
        const token = await getToken(notSubscriberUserAuthData);

        const response = await request(app)
            .post('/api/shelter/')
            .set('Authorization', 'Bearer ' + token)
            .send(validShelterData)
            .expect(403);
        expect(response.body).toHaveProperty('message', 'Access dined');
    });
    it('Shelter creating by user who has already shelter', async () => {
        const token = await getToken(userWhoHasAlreadyShelterAuthData);

        const response = await request(app)
            .post('/api/shelter/')
            .set('Authorization', 'Bearer ' + token)
            .send(validShelterData)
            .expect(400);
        expect(response.body).toHaveProperty('message', 'You already have registered shelter');
    });
    it('Shelter creating with invalid token', async () => {
        const response = await request(app)
            .post('/api/shelter/')
            .set('Authorization', 'Bearer invalidToken')
            .send(validShelterData)
            .expect(401);
        expect(response.body).toHaveProperty('message', 'Non authorized user');
    });
    it('Shelter creating without authorization token', async() => {
        const response = await request(app)
            .post('/api/shelter/')
            .send(validShelterData)
            .expect(401);
        expect(response.body).toHaveProperty('message', 'Non authorized user');
    });
    it('Shelter creating without data', async() => {
        const token =  await getToken(validUserAuthData);

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
    it('Shelter creating with too big name length, not correct city ' +
        'street house and domain', async () => {
        const token = await getToken(validUserAuthData);

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
    it('Shelter creating with existing data', async () => {
        const token = await getToken(validUserAuthData);

        const response = await request(app)
            .post('/api/shelter/')
            .set('Authorization', 'Bearer ' + token)
            .field('shelterName', existingShelterData.shelterName)
            .field('shelterCity', existingShelterData.shelterCity)
            .field('shelterStreet', existingShelterData.shelterStreet)
            .field('shelterHouse', existingShelterData.shelterHouse)
            .field('shelterDomain', existingShelterData.shelterDomain)
            .field('subscriberDomainEmail', existingShelterData.subscriberDomainEmail)
            .field('shelterImage', '')
            .expect(400);
        expect(response.body).toHaveProperty('message', 'Shelter with this data already exists');
    });
    it('Successful shelter creating', async () => {
        const token = await getToken(validUserAuthData);

        const response = await request(app)
            .post('/api/shelter/')
            .set('Authorization', 'Bearer ' + token)
            .attach('shelterImage', validShelterData.shelterImage)
            .field('shelterName', validShelterData.shelterName)
            .field('shelterCity', validShelterData.shelterCity)
            .field('shelterStreet', validShelterData.shelterStreet)
            .field('shelterHouse', validShelterData.shelterHouse)
            .field('shelterDomain', validShelterData.shelterDomain)
            .field('subscriberDomainEmail', validShelterData.subscriberDomainEmail)
            .expect(200)
        expect(response.body).toHaveProperty('message', 'Shelter successfully created');

        const shelter = await Shelter.findOne({where: {shelter_name: validShelterData.shelterName}});
        const shelterOwner = await User.findOne({where: {shelterId: shelter.id}});
        expect(shelter.shelter_name).toEqual(validShelterData.shelterName);
        expect(shelter.shelter_address).toEqual('City ' + validShelterData.shelterCity + ' street ' + validShelterData.shelterStreet + ' house ' + validShelterData.shelterHouse);
        expect(shelter.shelter_domain).toEqual(validShelterData.shelterDomain);
        expect(shelter.userId).toBe(shelterOwner.id);
        expect(shelterOwner.domain_email).toEqual(validShelterData.subscriberDomainEmail + validShelterData.shelterDomain);
        expect(shelter.shelter_image).toBeDefined();
    });
});

