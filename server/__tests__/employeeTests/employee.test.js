const app = require('../../index');
const {setup, teardown} = require('./setupTeardownEmployee');
const bcrypt = require('bcrypt');
const employeeCreatingTest = require('./employeeCreatingTest');
const employeeDeleteTest = require('./employeeDeleteTest');
const employeeGetAllTest = require('./employeeGetAllTest');
const employeeGetOneTest = require('./employeeGetOneTest');

const shelterInfo = {
    "shelterName": "testShelterName",
    "shelterAddress": "City Test street Test house test",
    "shelterDomain": "@test.test",
    "shelterImage": ""
};

const secondShelterInfo = {
    "shelterName": "secondShelterName",
    "shelterAddress": "City Test street Test house test",
    "shelterDomain": "@secondShelter.test",
    "shelterImage": ""
}

const defaultUserInfo = {
    "login": "defaultUser",
    "userImage": "",
    "domainEmail": "defaultUser@test.test",
    "email": "defaultUser@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "212121312",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": false
};

const employeeOfSecondShelter = {
    "login": "secondEmployee",
    "userImage": "",
    "domainEmail": "secondUser@secondShelter.test",
    "email": "secondUser@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "435431341",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": false
};

const subscriberWithOutShelterInfo = {
    "login": "subscriberWithOutShelter",
    "userImage": "",
    "domainEmail": null,
    "email": "subscriberWithOutShelter@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "6545343465",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": true
};

const workerAdminUserInfo = {
    "login": "workerAdminUser",
    "userImage": "",
    "domainEmail": "workerAdminUser@test.test",
    "email": "workerAdminUser@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "467657655",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": false
};

const existedEmployeeInfo = {
    "login": "existedEmployee",
    "userImage": "",
    "domainEmail": "existedEmployee@test.test",
    "email": "existedEmployee@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "6546543634",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": false
};

const addedEmployeeInfo = {
    "login": "addedEmployee",
    "userImage": "",
    "domainEmail": "addedEmployee@test.test",
    "email": "addedEmployee@gmail.com",
    "fullName": "Test Test Test",
    "birthday": "2004-05-02",
    "phoneNumber": "6876784457",
    "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
    "is_paid": false,
    "roles": "[ \"user\", \"workerAdmin\"]"
};

const defaultUserAuthInfo = {
    "login": "defaultUser",
    "password": 'ukraineUser24$'
};

const subscriberWithOutShelterAuthInfo = {
    "login": "subscriberWithOutShelter",
    "password": "ukraineUser24$"
}

const workerAdminUserAuthInfo = {
    "login": "workerAdminUser",
    "password": "ukraineUser24$"
}

const existedEmployeeAuthInfo = {
    "login": "existedEmployee",
    "password": "ukraineUser24$"
}

const employeeOfSecondShelterAuthInfo = {
    "login": "secondEmployee",
    "password": "ukraineUser24$"
}

describe('Employee tests', () => {
   beforeAll(async() => {
       await setup(
           shelterInfo,
           defaultUserInfo,
           subscriberWithOutShelterInfo,
           workerAdminUserInfo,
           existedEmployeeInfo,
           secondShelterInfo,
           employeeOfSecondShelter
       );
   }, 15000);

   afterAll(async () => {
       await teardown(
           shelterInfo,
           defaultUserInfo,
           subscriberWithOutShelterInfo,
           workerAdminUserInfo,
           existedEmployeeInfo,
           addedEmployeeInfo,
           secondShelterInfo,
           employeeOfSecondShelter
       );
   });

    describe('Employee creating test', () => {
        employeeCreatingTest.employeeCreatingByNotAuthorizedUser(addedEmployeeInfo);
        employeeCreatingTest.employeeCreatingByDefaultUser(addedEmployeeInfo, defaultUserAuthInfo);
        employeeCreatingTest.employeeCreatingByUserWithOutShelter(addedEmployeeInfo, subscriberWithOutShelterAuthInfo);
        employeeCreatingTest.employeeCreatingWithOutData(workerAdminUserAuthInfo);
        employeeCreatingTest.employeeCreatingWithExistedData(existedEmployeeInfo, workerAdminUserAuthInfo);
        employeeCreatingTest.employeeCreatingWithInvalidData(workerAdminUserAuthInfo);
        employeeCreatingTest.successfulEmployeeCreating(addedEmployeeInfo, workerAdminUserAuthInfo);
    });

    describe('Get one employee test', () => {
        employeeGetOneTest.getWithoutAuthToken(defaultUserInfo);
        employeeGetOneTest.getByInvalidAuthToken(defaultUserInfo);
        employeeGetOneTest.getByUserWithOutShelter(subscriberWithOutShelterAuthInfo, defaultUserInfo);
        employeeGetOneTest.getByNotShelterMember(defaultUserInfo, employeeOfSecondShelterAuthInfo);
        employeeGetOneTest.getWithInvalidId(workerAdminUserAuthInfo);
        employeeGetOneTest.successfulGettingEmployee(defaultUserInfo, workerAdminUserAuthInfo);

    });

    describe('Get all employee test', () => {
        employeeGetAllTest.getAllEmployeeWithoutAuthToken();
        employeeGetAllTest.getAllEmployeeByNonAuthorizedToken();
        employeeGetAllTest.getAllEmployeeByUserWithOutShelter(subscriberWithOutShelterAuthInfo);
        employeeGetAllTest.successfulGettingAllEmployee(workerAdminUserAuthInfo);
    });

    describe('Employee deleting test', () => {
        employeeDeleteTest.deleteEmployeeWithOutAuthToken(workerAdminUserAuthInfo);
        employeeDeleteTest.deleteEmployeeWithInvalidAuthToken(workerAdminUserAuthInfo);
        employeeDeleteTest.deleteEmployeeByNotShelterMember(employeeOfSecondShelterAuthInfo, defaultUserInfo);
        employeeDeleteTest.deletingWithNotCorrectRole(defaultUserAuthInfo, workerAdminUserInfo);
        employeeDeleteTest.subscriberDeleting(workerAdminUserAuthInfo, existedEmployeeInfo);
        employeeDeleteTest.deleteUserWithInvalidId(workerAdminUserAuthInfo);
        employeeDeleteTest.successfulDeleting(workerAdminUserAuthInfo, defaultUserInfo);
    });
});