const app = require('../../index').app;
const {setup, teardown} = require('./setupTeardownPetTest');
const createPetTest = require('./createPetTest');
const deletePetTest = require('./deletePetTest');
const getAllPetsTest = require('./getAllPetsTest');
const getOnePetTest = require('./getOnePetTest');
const updatePetTest = require('./updatePetTest');
const bcrypt = require("bcrypt");
const path = require('path')


const shelter = {
   "shelterName": "TestName",
   "shelterAddress": "City Київ street Героїв України house 70",
   "shelterCity": "Харків",
   "shelterStreet": "Французький Бульвар",
   "shelterHouse": "70",
   "shelterDomain": "@test.com",
   "shelterImage": "",
   "subscriberDomainEmail": "sub"
}

const secondShelter = {
   "shelterName": "SecondShelter",
   "shelterAddress": "City Київ street Героїв України house 70",
   "shelterCity": "Харків",
   "shelterStreet": "Французький Бульвар",
   "shelterHouse": "70",
   "shelterDomain": "@second.com",
   "shelterImage": "",
   "subscriberDomainEmail": "dsa"
}

const addingPetData = {
   "petName": "addingPetName",
   "petAge": 4,
   "petGender": "female",
   "cellNumber": "12A",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Кішка\"}," +
       "{\"title\": \"Колір\", \"description\": \"Сірий\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const petForUpdating = {
   "petName": "petForUpdating",
   "petAge": 6,
   "petGender": "male",
   "cellNumber": "65C",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Собака\"}," +
       "{\"title\": \"Колір\", \"description\": \"Чорний\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const testPet1 = {
   "petName": "testPet1",
   "petAge": 6,
   "petGender": "male",
   "cellNumber": "65C",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Собака\"}," +
       "{\"title\": \"Колір\", \"description\": \"Чорний\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const testPet2 = {
   "petName": "testPet2",
   "petAge": 4,
   "petGender": "female",
   "cellNumber": "12A",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Кішка\"}," +
       "{\"title\": \"Колір\", \"description\": \"Сірий\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const petForDeleting = {
   "petName": "petForDeleting",
   "petAge": 4,
   "petGender": "female",
   "cellNumber": "12A",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Кішка\"}," +
       "{\"title\": \"Колір\", \"description\": \"Сірий\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const newPetData = {
   "petName": "newPetData",
   "petAge": 10,
   "petGender": "female",
   "cellNumber": "48b",
   "info": "[" +
       "{\"title\": \"Вид\", \"description\": \"Кішка\"}," +
       "{\"title\": \"Колір\", \"description\": \"Помаранчевий\"}" +
       " ]",
   "petImage": path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg')
};

const defaultUserInfo = {
   "login": "defaultUser",
   "userImage": "",
   "domainEmail": "defaultUser@test.com",
   "email": "defaultUser@gmail.com",
   "fullName": "Test Test Test",
   "birthday": "2004-05-02",
   "phoneNumber": "212121312",
   "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
   "is_paid": false
};

const userWithoutShelterInfo = {
   "login": "userWithoutShelter",
   "userImage": "",
   "domainEmail": null,
   "email": "userWithoutShelter@gmail.com",
   "fullName": "Test Test Test",
   "birthday": "2004-05-02",
   "phoneNumber": "123213213",
   "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
   "is_paid": false
};

const petAdminInfo = {
   "login": "petAdmin",
   "userImage": "",
   "domainEmail": "petAdmin@test.com",
   "email": "petAdmin@gmail.com",
   "fullName": "Test Test Test",
   "birthday": "2004-05-02",
   "phoneNumber": "4234234",
   "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
   "is_paid": false
};

const secondShelterEmployee = {
   "login": "secondShelterEmployee",
   "userImage": "",
   "domainEmail": "secondShelterEmployee@second.com",
   "email": "secondShelterEmployee@gmail.com",
   "fullName": "Test Test Test",
   "birthday": "2004-05-02",
   "phoneNumber": "4234234",
   "hashedPassword": bcrypt.hashSync("ukraineUser24$", 7),
   "is_paid": false
}

const defaultUserAuthInfo = {
   "login": "defaultUser",
   "password": "ukraineUser24$"
};

const userWithoutShelterAuthInfo = {
   "login": "userWithoutShelter",
   "password": "ukraineUser24$"
}

const petAdminAuthInfo = {
   "login": "petAdmin",
   "password": "ukraineUser24$"
}

const secondShelterEmployeeAuthInfo = {
   "login": "secondShelterEmployee",
   "password": "ukraineUser24$"
}


describe('Pet tests', () => {
   beforeAll(async () => {
       await setup(
           shelter,
           secondShelter,
           petForUpdating,
           testPet1,
           testPet2,
           petForDeleting,
           defaultUserInfo,
           userWithoutShelterInfo,
           petAdminInfo,
           secondShelterEmployee
       );
   }, 15000);

   afterAll(async () => {
       await teardown(
           shelter,
           secondShelter,
           addingPetData,
           petForUpdating,
           testPet1,
           testPet2,
           petForDeleting,
           defaultUserInfo,
           userWithoutShelterInfo,
           petAdminInfo,
           secondShelterEmployee,
           newPetData
       );
   }, 15000);



   describe('Create pet tests', () => {
      createPetTest.petCreatingWithoutToken(addingPetData);
      createPetTest.petCreatingWithInvalidToken(addingPetData);
      createPetTest.petCreatingWithInvalidRole(addingPetData, defaultUserAuthInfo);
      createPetTest.petCreatingByUserWithoutShelter(addingPetData, userWithoutShelterAuthInfo);
      createPetTest.petCreatingWithoutData(petAdminAuthInfo);
      createPetTest.petCreatingWithInvalidData(petAdminAuthInfo);
      createPetTest.successfulPetCreating(petAdminAuthInfo, addingPetData);
   });

   describe('Update pet tests', () => {
      updatePetTest.petUpdatingWithoutToken(petForUpdating, newPetData);
      updatePetTest.petUpdatingWithInvalidToken(petForUpdating, newPetData);
      updatePetTest.petUpdatingWithInvalidRole(petForUpdating, newPetData, defaultUserAuthInfo);
      updatePetTest.petUpdatingByUserWithoutShelter(petForUpdating, newPetData, userWithoutShelterAuthInfo);
      updatePetTest.petUpdatingWithoutData(petAdminAuthInfo, petForUpdating);
      updatePetTest.petUpdatingWithInvalidData(petAdminAuthInfo, petForUpdating);
      updatePetTest.petUpdatingByNotShelterMember(secondShelterEmployeeAuthInfo, petForUpdating, newPetData);
      updatePetTest.petUpdatingWithInvalidId(petAdminAuthInfo, newPetData);
      updatePetTest.successfulPetUpdating(petAdminAuthInfo, petForUpdating, newPetData);
   });

   describe('Get one pet tests', () => {
      getOnePetTest.getOnePetWithoutToken(testPet1);
      getOnePetTest.getOnePetWithInvalidToken(testPet1);
      getOnePetTest.getOnePetByUserWithOutShelter(userWithoutShelterAuthInfo, testPet1);
      getOnePetTest.getOnePetByNotShelterMember(secondShelterEmployeeAuthInfo, testPet1);
      getOnePetTest.getOnePetWithInvalidId(defaultUserAuthInfo);
      getOnePetTest.successfulGettingOnePet(defaultUserAuthInfo, testPet1);
   });

   describe('Get all pets test', () => {
      getAllPetsTest.getAllPetsWithoutToken();
      getAllPetsTest.getAllPetsWithInvalidToken();
      getAllPetsTest.getAllPetsByUserWithoutShelter(userWithoutShelterAuthInfo);
      getAllPetsTest.successfulGettingAllPets(defaultUserAuthInfo);
   });

   describe('Delete pet tests', () => {
      deletePetTest.petDeletingWithoutToken(petForDeleting);
      deletePetTest.petDeletingWithInvalidToken(petForDeleting);
      deletePetTest.petDeletingWithInvalidRole(petForDeleting, defaultUserAuthInfo);
      deletePetTest.petDeletingByUserWithoutShelter(petForDeleting, userWithoutShelterAuthInfo);
      deletePetTest.petDeletingByNotShelterMember(petForDeleting, secondShelterEmployeeAuthInfo);
      deletePetTest.petDeletingWithInvalidId(petAdminInfo);
      deletePetTest.successfulPetDeleting(petForDeleting, petAdminAuthInfo);
   });
});