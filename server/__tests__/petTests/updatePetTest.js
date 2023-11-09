const app = require('../../index').app;
const request = require('supertest');
const getToken = require('../../functions/getToken');
const {Pet, PetCharacteristic} = require('../../models/models');
const path = require("path");


class UpdatePetTest{
    updatePetPath = '/api/pet/'

    petUpdatingWithoutToken(petData, newData){
        test('Pet updating without token', async() => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .attach('petImage', newData.petImage)
               .field('petName', newData.petName)
               .field('petAge', newData.petAge)
               .field('petGender', newData.petGender)
               .field('cellNumber', newData.cellNumber)
               .field('info', newData.info)
               .expect(401);
           expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    petUpdatingWithInvalidToken(petData, newPetData){
        test('Pet updating with invalid token', async() => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});
           const invalidToken = 'fdafsafsafdsaf';

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .set('Authorization', 'Bearer ' + invalidToken)
               .attach('petImage', newPetData.petImage)
               .field('petName', newPetData.petName)
               .field('petAge', newPetData.petAge)
               .field('petGender', newPetData.petGender)
               .field('cellNumber', newPetData.cellNumber)
               .field('info', newPetData.info)
               .expect(401);
           expect(response.body).toHaveProperty('message', 'Non authorized user');
        });
    }

    petUpdatingWithInvalidRole(petData, newPetData, defaultUserAuthInfo){
        test('Pet updating with invalid role', async () => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});
           const token = await getToken(defaultUserAuthInfo);

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .set('Authorization', 'Bearer ' + token)
               .attach('petImage', newPetData.petImage)
               .field('petName', newPetData.petName)
               .field('petAge', newPetData.petAge)
               .field('petGender', newPetData.petGender)
               .field('cellNumber', newPetData.cellNumber)
               .field('info', newPetData.info)
               .expect(403);
           expect(response.body).toHaveProperty('message', 'Access dined');
        });
    }

    petUpdatingByUserWithoutShelter(petData, newPetData, userWithoutShelterAuthInfo){
        test('Pet updating by user without shelter', async() => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});
           const token = await getToken(userWithoutShelterAuthInfo);

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .set('Authorization', 'Bearer ' + token)
               .attach('petImage', newPetData.petImage)
               .field('petName', newPetData.petName)
               .field('petAge', newPetData.petAge)
               .field('petGender', newPetData.petGender)
               .field('cellNumber', newPetData.cellNumber)
               .field('info', newPetData.info)
               .expect(400);

           expect(response.body).toHaveProperty('message', 'You do not have a shelter');
        });
    }

    petUpdatingWithoutData(petAdminUserAuthData, petData){
        test('Pet updating without data', async() => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});
           const token = await getToken(petAdminUserAuthData);

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .set('Authorization', 'Bearer ' + token)
               .attach('petImage', path.resolve(__dirname ,'..', '..', 'static', 'testImage', 'test-pet-image.jpg'))
               .field('petName', '')
               .field('petAge', '')
               .field('petGender', '')
               .field('cellNumber', '')
               .field('info', '')
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

    petUpdatingWithInvalidData(petAdminUserAuthData, petData){
        test('Pet updating with invalid data', async() => {
           const pet = await Pet.findOne({where: {pet_name: petData.petName}});
           const token = await getToken(petAdminUserAuthData);

           const response = await request(app)
               .put(this.updatePetPath + pet.id)
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

    petUpdatingByNotShelterMember(notShelterMemberAuthInfo, petData, newPetData){
        test('Pet updating by user without shelter', async () => {
            const pet = await Pet.findOne({where: {pet_name: petData.petName}});
            const token = await getToken(notShelterMemberAuthInfo);

            const response = await request(app)
                .put(this.updatePetPath + pet.id)
                .set('Authorization', 'Bearer ' + token)
                .attach('petImage', newPetData.petImage)
                .field('petName', newPetData.petName)
                .field('petAge', newPetData.petAge)
                .field('petGender', newPetData.petGender)
                .field('cellNumber', newPetData.cellNumber)
                .field('info', newPetData.info)
                .expect(403);
            expect(response.body).toHaveProperty('message', 'You do not have access to information of this shelter');
        })
    }

    petUpdatingWithInvalidId(petAdminAuthInfo, newPetData){
        test('Pet updating with invalid ID', async() => {
            const token = await getToken(petAdminAuthInfo);

            const response = await request(app)
                .put(this.updatePetPath + 1)
                .set('Authorization', 'Bearer ' + token)
                .attach('petImage', newPetData.petImage)
                .field('petName', newPetData.petName)
                .field('petAge', newPetData.petAge)
                .field('petGender', newPetData.petGender)
                .field('cellNumber', newPetData.cellNumber)
                .field('info', newPetData.info)
                .expect(400);
            expect(response.body).toHaveProperty('message', 'There is no pet with id: 1');
        });
    }

    successfulPetUpdating(petAdminUserAuthData, petData, newPetData){
        test('Successful pet updating', async() => {
            const pet = await Pet.findOne({where: {pet_name: petData.petName}});
            const token = await getToken(petAdminUserAuthData);

            const response = await request(app)
               .put(this.updatePetPath + pet.id)
               .set('Authorization', 'Bearer ' + token)
               .attach('petImage', newPetData.petImage)
               .field('petName', newPetData.petName)
               .field('petAge', newPetData.petAge)
               .field('petGender', newPetData.petGender)
               .field('cellNumber', newPetData.cellNumber)
               .field('info', newPetData.info)
               .expect(200);

            const updatedPet = await Pet.findOne({where: {pet_name: newPetData.petName}})
            const createdPetCharacteristics = await PetCharacteristic.findAll({
                where: { petId: updatedPet.id },
                attributes: ['description', 'title']
            });
            expect(updatedPet.pet_name).toEqual(response.body.pet_name);
            expect(updatedPet.pet_age).toEqual(response.body.pet_age);
            expect(updatedPet.cell_number).toEqual(response.body.cell_number);
            expect(updatedPet.pet_gender).toEqual(response.body.pet_gender);
            expect(updatedPet.pet_image).toEqual(response.body.pet_image);
            //expect(createdPetCharacteristics).toEqual(expect.arrayContaining(response.body.PetCharacteristic));
        });
    }

}

module.exports = new UpdatePetTest();