const app = require('../../index');
const {setup, teardown} = require('./setupTeardownShelterTest');
const bcrypt = require('bcrypt');
const shelterCreatingTest = require('./shelterCreatingTest');
const shelterUpdatingTest = require('./shelterUpdatingTest');
const shelterDeletingTest = require('./shelterDeletingTest');
const gettingShelterTest = require('./gettingShelterTest');

const notSubscriber = {
    "login": "notSubscriberTestUser",
    "user_image": "default-user-image.jpg",
    "domain_email": "notSubscriber@test.com",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "1234567",
    "hashed_password": bcrypt.hashSync('ukraineUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
}

const subscriberWithShelter = {
    "login": "subscriberWithShelterTest",
    "user_image": "default-user-image.jpg",
    "domain_email": "useWhoHasShelterr@existed.domain",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "12345678",
    "hashed_password": bcrypt.hashSync('ukraineUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
}

const subscriberWithOutShelter = {
    "login": "subscriberWithOutShelter",
    "user_image": "default-user-image.jpg",
    "domain_email": "",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "532432543",
    "hashed_password": bcrypt.hashSync('ukraineUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
};

const subscriberForUpdating = {
    "login": "subscriberForUpdating",
    "user_image": "default-user-image.jpg",
    "domain_email": "user@update.test",
    "full_name": "Test User",
    "birthday": "2004-05-02",
    "phone_number": "4324234234",
    "hashed_password": bcrypt.hashSync('ukraineUser24$', 7),
    "date_of_registration": "2004-05-02",
    "is_paid": false
};

const notSubscriberAuthData = {
    "login": "notSubscriberTestUser",
    "password": "ukraineUser24$"
};

const subscriberForUpdatingAuthData = {
    "login": "subscriberForUpdating",
    "password": "ukraineUser24$"
};

const subscriberWithShelterAuthData = {
    "login": "subscriberWithShelterTest",
    "password": "ukraineUser24$"
};

const subscriberWithOutShelterAuthData = {
    "login": "subscriberWithOutShelter",
    "password": "ukraineUser24$"
};

const existedShelter = {
    "shelterName": "existedShelterName",
    "shelterCity": "UpdatedTestCity",
    "shelterStreet": "UpdatedTestStreet",
    "shelterHouse": "Updated40",
    "shelterDomain": "@existed.domain",
    "shelterImage": 'default-shelter-image.jpg',
    "subscriberDomainEmail": "sub@existed.domain"
}

const addingShelterData = {
    "shelterName": "TestName",
    "shelterAddress": "City Київ street Героїв України house 70",
    "shelterCity": "Харків",
    "shelterStreet": "Французький Бульвар",
    "shelterHouse": "70",
    "shelterDomain": "@test.com",
    "shelterImage": "",
    "subscriberDomainEmail": "sub"
};

const updatingShelterData = {
    "shelterName": "UpdatedTestShelterFor",
    "shelterCity": "UpdatedTestCity",
    "shelterStreet": "UpdatedTestStreet",
    "shelterHouse": "Updated40",
    "shelterDomain": "@test.ua",
    "shelterImage": '',
};

const shelterForUpdating = {
    "shelterName": "shelterForUpdating",
    "shelterCity": "Shelter-City",
    "shelterStreet": "Shelter-Street",
    "shelterHouse": "Shelter-House",
    "shelterDomain": "@update.test",
    "shelterImage": '',
}
describe('Shelter test', () => {
   beforeAll(async() => {
       await setup(
           notSubscriber,
           subscriberWithShelter,
           subscriberWithOutShelter,
           existedShelter,
           subscriberForUpdating,
           shelterForUpdating
       );
   }, 10000);
   afterAll(async () => {
      await teardown(
          notSubscriber,
          subscriberWithShelter,
          subscriberWithOutShelter,
          existedShelter,
          addingShelterData,
          updatingShelterData,
          subscriberForUpdating,
          shelterForUpdating
      );
   });
    describe('Shelter creating test', () => {
        shelterCreatingTest.creatingByNotSubscriber(notSubscriberAuthData, addingShelterData);
        shelterCreatingTest.creatingByUserWithShelter(subscriberWithShelterAuthData, addingShelterData);
        shelterCreatingTest.creatingWithInvalidToken(addingShelterData);
        shelterCreatingTest.creatingWithOutToken(addingShelterData);
        shelterCreatingTest.creatingWithOutData(subscriberWithOutShelterAuthData);
        shelterCreatingTest.creatingWithInvalidData(subscriberWithOutShelterAuthData);
        shelterCreatingTest.creatingWithExistedData(subscriberWithOutShelterAuthData, existedShelter);
        shelterCreatingTest.successfulCreating(subscriberWithOutShelterAuthData, addingShelterData);
    });

    describe('Shelter updating test', () => {
        shelterUpdatingTest.updatingByNotAuthorizedUser(updatingShelterData, shelterForUpdating);
        shelterUpdatingTest.updatingByNotSubscriber(notSubscriberAuthData, shelterForUpdating, updatingShelterData);
        shelterUpdatingTest.updatingBoNotOwner(shelterForUpdating, subscriberWithShelterAuthData, updatingShelterData);
        shelterUpdatingTest.updatingWithOutData(shelterForUpdating, subscriberForUpdatingAuthData);
        shelterUpdatingTest.withExistedDomain(subscriberForUpdatingAuthData, shelterForUpdating, existedShelter, updatingShelterData);
        shelterUpdatingTest.withExistedName(subscriberForUpdatingAuthData, shelterForUpdating, existedShelter, updatingShelterData);
        shelterUpdatingTest.withInvalidData(subscriberForUpdatingAuthData, shelterForUpdating);
        shelterUpdatingTest.successfulUpdating(subscriberForUpdatingAuthData, shelterForUpdating, updatingShelterData);
    });

    describe('Getting shelter info test', () => {
        gettingShelterTest.getShelterByNotAuthorizedUser(existedShelter);
        gettingShelterTest.getShelterByNotDomainUser(existedShelter, subscriberWithOutShelterAuthData);
        gettingShelterTest.successfulGettingShelter(existedShelter, subscriberWithShelterAuthData);
    });

    describe('Shelter deleting test', () => {
       shelterDeletingTest.deletingByNotAuthorizedUser(existedShelter);
       shelterDeletingTest.deletingByNotSubscriber(existedShelter, notSubscriberAuthData);
       shelterDeletingTest.deletingByNotShelterOwner(existedShelter, subscriberWithOutShelterAuthData);
       shelterDeletingTest.successfulDeleting(existedShelter, subscriberWithShelterAuthData);
    });

});