const app = require('../../index').app;
const request = require('supertest');
const {Pet, PetCharacteristic} = require('../../models/models');
const getToken = require('../../functions/getToken');
const fs = require('fs');
const path = require("path");

class CreatePetTest{
    petCreatingPath = '/api/pet/'
    petCreatingWithoutToken(petData){
        test('Pet creating without authorization token', async () => {
            const response = await request(app)
                .post(this.petCreatingPath)
                .field('petName', petData.petName)
                .field('petAge', petData.petAge)
                .field('petGender', petData.petGender)
                .field('cellNumber', petData.cellNumber)
                .field('info', petData.info)
                .attach('petImage', petData.petImage)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    petCreatingWithInvalidToken(petData){
        test('Pet creating with invalid authorization token', async () => {
            const invalidToken = 'ijafjodsjaoifsdafd';
            const response = await request(app)
                .post(this.petCreatingPath)
                .set('Authorization', 'Bearer ' + invalidToken)
                .field('petName', petData.petName)
                .field('petAge', petData.petAge)
                .field('petGender', petData.petGender)
                .field('cellNumber', petData.cellNumber)
                .field('info', petData.info)
                .attach('petImage', petData.petImage)
                .expect(401);
            expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    petCreatingWithInvalidRole(petData, defaultUserAuthInfo){
        test('Pet creating by user with invalid role', async () => {
            const token = await getToken(defaultUserAuthInfo);

            const response = await request(app)
                .post(this.petCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('petName', petData.petName)
                .field('petAge', petData.petAge)
                .field('petGender', petData.petGender)
                .field('cellNumber', petData.cellNumber)
                .field('info', petData.info)
                .attach('petImage', petData.petImage)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    petCreatingByUserWithoutShelter(petData, userWithoutShelterAuthInfo){
        test('Pet creating by user without shelter', async () => {
            const token = await getToken(userWithoutShelterAuthInfo);

            const response = await request(app)
                .post(this.petCreatingPath)
                .attach('petImage', petData.petImage)
                .set('Authorization', 'Bearer ' + token)
                .field('petName', petData.petName)
                .field('petAge', petData.petAge)
                .field('petGender', petData.petGender)
                .field('cellNumber', petData.cellNumber)
                .field('info', petData.info)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'You do not have a shelter');
        });
    }

    petCreatingWithoutData(petAdminUserAuthData){
        test('Pet creating without data', async () => {
            const token = await getToken(petAdminUserAuthData);

            const response = await request(app)
                .post(this.petCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .field('petName', '')
                .field('petAge', '')
                .field('petGender', '')
                .field('cellNumber', '')
                .field('info', '')
                .attach('petImage', path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg'))
                .expect(400);
            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;
            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter the name of pet",
                    "path": "petName",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter the age of pet",
                    "path": "petAge",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter gender of the pet",
                    "path": "petGender",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter pet's cell number",
                    "path": "cellNumber",
                    "location": "body"
                }
            ]));
        });
    }

    petCreatingWithInvalidData(petAdminUserAuthData){
        test('Pet creating with invalid data', async () => {
            const token = await getToken(petAdminUserAuthData);

            const response = await request(app)
                .post(this.petCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .attach('petImage', path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg'))
                .field('petName', 321)
                .field('petAge', '')
                .field('petGender', 'test')
                .field('cellNumber', 321)
                .field('info', '')
                .expect(400);
            expect(response.body).toHaveProperty('message');
            const errors = response.body.message.errors;
            expect(errors).toEqual(expect.arrayContaining([
                {
                    "type": "field",
                    "value": "",
                    "msg": "Please enter the age of pet",
                    "path": "petAge",
                    "location": "body"
                },
                {
                    "type": "field",
                    "value": "test",
                    "msg": "Gender must be \"male\" or \"female\"",
                    "path": "petGender",
                    "location": "body"
                }
            ]));
        });
    }

    successfulPetCreating(petAdminUserAuthData, petData){
        test('Successful pet creating', async () => {
            const token = await getToken(petAdminUserAuthData);

            const response = await request(app)
                .post(this.petCreatingPath)
                .set('Authorization', 'Bearer ' + token)
                .attach('petImage', petData.petImage)
                .field('petName', petData.petName)
                .field('petAge', petData.petAge)
                .field('petGender', petData.petGender)
                .field('cellNumber', petData.cellNumber)
                .field('info', petData.info)
                .expect(200);
            const createdPet = await Pet.findOne({where: {pet_name: petData.petName}});
            const createdPetCharacteristics = await PetCharacteristic.findAll({
                where: { petId: createdPet.id },
                attributes: ['description', 'title']
            });
            console.log(createdPetCharacteristics)
            const expectedInfoArray = JSON.parse(petData.info);

            expect(createdPet.pet_name).toEqual(petData.petName);
            expect(createdPet.pet_age).toEqual(petData.petAge);
            expect(createdPet.pet_gender).toEqual(petData.petGender);
            expect(createdPet.cell_number).toEqual(petData.cellNumber);
            expect(fs.existsSync(path.resolve('..', '..', 'static', createdPet.pet_image)));
        });
    }

}

module.exports = new CreatePetTest();