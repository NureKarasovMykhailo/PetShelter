const request = require('supertest');
const app = require('../../index').app;
const getToken = require('../../functions/getToken');
const bcrypt = require("bcrypt");
const path = require("node:path");
const {User, UserRole, Shelter} = require('../../models/models');

const notSubscriberUserData = {
    "login": "notSubscriberUseTest",
    "user_image": "default-user-image.jpg",
    "domain_email": "notSub@test.com",
    "email": "test@test.ua",
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
    "domain_email": "notOwner@lapki.org",
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
};

const shelterData = {
    "shelterName": "TestShelterForUpdating",
    "shelterCity": "TestCity",
    "shelterStreet": "TestStreet",
    "shelterHouse": "40",
    "shelterDomain": "@test.com",
    "shelterImage": path.resolve(__dirname, '../../static/', 'test-shelter-image.jpg'),
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

describe('Getting one shelter test', () => {
    beforeAll(async () => {
       const notSubscriber = await User.create(
           {
               login: notSubscriberUserData.login,
               email: notSubscriberUserData.email,
               user_image: notSubscriberUserData.user_image,
               domain_email: notSubscriberUserData.domain_email,
               full_name: notSubscriberUserData.full_name,
               birthday: notSubscriberUserData.birthday,
               phone_number: notSubscriberUserData.phone_number,
               date_of_registration: notSubscriberUserData.date_of_registration,
               hashed_password: notSubscriberUserData.hashed_password,
               is_paid: notSubscriberUserData.is_paid
           }
       );
       const notOwner = await User.create(
           {
               login: notOwnerUserData.login,
               email: notOwnerUserData.email,
               user_image: notOwnerUserData.user_image,
               domain_email: notOwnerUserData.domain_email,
               full_name: notOwnerUserData.full_name,
               birthday: notOwnerUserData.birthday,
               phone_number: notOwnerUserData.phone_number,
               date_of_registration: notOwnerUserData.date_of_registration,
               hashed_password: notOwnerUserData.hashed_password,
               is_paid: notOwnerUserData.is_paid
           }
       );
        const ownerUser = await User.create(
            {
                login: ownerUserData.login,
                email: ownerUserData.email,
                user_image: ownerUserData.user_image,
                domain_email: ownerUserData.domain_email,
                full_name: ownerUserData.full_name,
                birthday: ownerUserData.birthday,
                phone_number: ownerUserData.phone_number,
                date_of_registration: ownerUserData.date_of_registration,
                hashed_password: ownerUserData.hashed_password,
                is_paid: ownerUserData.is_paid
            }
        );
        const notRightShelter = await Shelter.create(
            {
                shelter_name: existingShelterData.shelterName,
                shelter_address: existingShelterData.shelterCity,
                shelter_domain: existingShelterData.shelterDomain,
                shelter_image: existingShelterData.shelterImage
            }
        );
        const shelter = await Shelter.create(
            {
                shelter_name: shelterData.shelterName,
                shelter_address: shelterData.shelterCity,
                shelter_domain: shelterData.shelterDomain,
                shelter_image: shelterData.shelterImage
            }
        );
        await UserRole.create({userId: notSubscriber.id, roleId: 2});
        await UserRole.create({userId: notOwner.id, roleId: 1});
        await UserRole.create({userId: ownerUser.id, roleId: 1});
        notRightShelter.userId = notOwner.id;
        notOwner.shelterId = notRightShelter.id;
        await notRightShelter.save();
        await notOwner.save();
        shelter.userId = ownerUser.id;
        ownerUser.shelterId = shelter.id;
        await shelter.save();
        await ownerUser.save();
    });

    afterAll(async () => {
        await User.destroy({where: {login: ownerUserData.login}});
        await User.destroy({where: {login: notOwnerUserData.login}});
        await User.destroy({where: {login: notSubscriberUserData.login}});
        await Shelter.destroy({where: {shelter_name: shelterData.shelterName}});
        await Shelter.destroy({where: {shelter_name: existingShelterData.shelterName}});
    });

    it('Getting shelter info by not authorized user', async () => {
        const shelter = await Shelter.findOne({where: {shelter_name: shelterData.shelterName}});


    });
    it('Getting shelter info by not subscriber', async () => {

    });
    it('Getting shelter info by not owner', async () => {

    });
    it('Getting shelter info by owner', async () => {

    });
})