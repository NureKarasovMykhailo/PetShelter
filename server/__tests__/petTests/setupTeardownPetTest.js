const {Shelter, User, UserRole, Role, Pet, PetCharacteristic} = require("../../models/models");
const path = require('path');
const fs = require('fs');

async function _createPetCharacteristic(info, petId){
    info = JSON.parse(info);
    await Promise.all(info.map(async i => {
        await PetCharacteristic.create({
            title: i.title,
            description: i.description,
            petId: petId
        })
    }));
}

async function _deletePetData(pets){
    await Promise.all(pets.map(async pet => {
        await PetCharacteristic.destroy({where: {petId: pet.id}});
        const filePath = path.resolve(__dirname, '..', '..', 'static', pet.pet_image);
        if (fs.existsSync(filePath) && !filePath.includes('test-pet-image.jpg')) {
            fs.unlinkSync(filePath);
        }
        await pet.destroy();
    }));
}

async function setup(
    shelterInfo,
    secondShelterInfo,
    petForUpdatingInfo,
    testPet1Info,
    testPet2Info,
    petForDeletingInfo,
    defaultUserInfo,
    userWithoutShelterInfo,
    petAdminInfo,
    secondShelterEmployeeInfo,
) {
    const shelter = await Shelter.create({
        shelter_name: shelterInfo.shelterName,
        shelter_address: shelterInfo.shelterAddress,
        shelter_domain: shelterInfo.shelterDomain,
        shelter_image: shelterInfo.shelterImage
    });

    const secondShelter = await Shelter.create({
        shelter_name: secondShelterInfo.shelterName,
        shelter_address: secondShelterInfo.shelterAddress,
        shelter_domain: secondShelterInfo.shelterDomain,
        shelter_image: secondShelterInfo.shelterImage
    });

    const petForUpdating = await Pet.create({
        pet_name: petForUpdatingInfo.petName,
        pet_age: petForUpdatingInfo.petAge,
        pet_gender: petForUpdatingInfo.petGender,
        cell_number: petForUpdatingInfo.cellNumber,
        pet_image: petForUpdatingInfo.petImage
    });
    await _createPetCharacteristic(petForUpdatingInfo.info, petForUpdating.id);
    petForUpdating.shelterId = shelter.id;
    await petForUpdating.save();

    const testPet1 = await Pet.create({
        pet_name: testPet1Info.petName,
        pet_age: testPet1Info.petAge,
        pet_gender: testPet1Info.petGender,
        cell_number: testPet1Info.cellNumber,
        pet_image: testPet1Info.petImage
    });
    await _createPetCharacteristic(testPet1Info.info, testPet1.id);
    testPet1.shelterId = shelter.id;
    await testPet1.save();

    const testPet2 = await Pet.create({
        pet_name: testPet2Info.petName,
        pet_age: testPet2Info.petAge,
        pet_gender: testPet2Info.petGender,
        cell_number: testPet2Info.cellNumber,
        pet_image: testPet2Info.petImage
    });
    await _createPetCharacteristic(testPet1Info.info, testPet2.id);
    testPet2.shelterId = shelter.id;
    await testPet2.save();

    const petForDeleting = await Pet.create({
        pet_name: testPet2Info.petName,
        pet_age: testPet2Info.petAge,
        pet_gender: testPet2Info.petGender,
        cell_number: testPet2Info.cellNumber,
        pet_image: testPet2Info.petImage
    });
    await _createPetCharacteristic(petForDeletingInfo.info, petForDeleting.id);
    petForDeleting.shelterId = shelter.id;
    await petForDeleting.save();

    const userRole = await Role.findOne({where: {role_title: 'user'}});
    const subscriberRole = await Role.findOne({where: {role_title: 'subscriber'}});
    const petAdminRole = await Role.findOne({where: {role_title: 'petAdmin'}});

    const defaultUser = await User.create({
        login: defaultUserInfo.login,
        user_image: defaultUserInfo.userImage,
        domain_email: defaultUserInfo.domainEmail,
        email: defaultUserInfo.email,
        full_name: defaultUserInfo.full_name,
        birthday: defaultUserInfo.birthday,
        phone_number: defaultUserInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: defaultUserInfo.hashedPassword,
        is_paid: defaultUserInfo.isPaid
    });
    defaultUser.shelterId = shelter.id;
    await UserRole.create({userId: defaultUser.id, roleId: userRole.id});
    await defaultUser.save();

    const userWithoutShelter = await User.create({
        login: userWithoutShelterInfo.login,
        user_image: userWithoutShelterInfo.userImage,
        domain_email: userWithoutShelterInfo.domainEmail,
        email: userWithoutShelterInfo.email,
        full_name: userWithoutShelterInfo.full_name,
        birthday: userWithoutShelterInfo.birthday,
        phone_number: userWithoutShelterInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: userWithoutShelterInfo.hashedPassword,
        is_paid: userWithoutShelterInfo.isPaid
    });
    await UserRole.create({userId: userWithoutShelter.id, roleId: petAdminRole.id});

    const petAdmin = await User.create({
        login: petAdminInfo.login,
        user_image: petAdminInfo.userImage,
        domain_email: petAdminInfo.domainEmail,
        email: petAdminInfo.email,
        full_name: petAdminInfo.full_name,
        birthday: petAdminInfo.birthday,
        phone_number: petAdminInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: petAdminInfo.hashedPassword,
        is_paid: petAdminInfo.isPaid
    });
    await UserRole.create({userId: petAdmin.id, roleId: petAdminRole.id});
    petAdmin.shelterId = shelter.id;
    await petAdmin.save();

    const secondShelterEmployee = await User.create({
        login: secondShelterEmployeeInfo.login,
        user_image: secondShelterEmployeeInfo.userImage,
        domain_email: secondShelterEmployeeInfo.domainEmail,
        email: secondShelterEmployeeInfo.email,
        full_name: secondShelterEmployeeInfo.full_name,
        birthday: secondShelterEmployeeInfo.birthday,
        phone_number: secondShelterEmployeeInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: secondShelterEmployeeInfo.hashedPassword,
        is_paid: secondShelterEmployeeInfo.isPaid
    });
    await UserRole.create({userId: secondShelterEmployee.id, roleId: subscriberRole.id});
    secondShelterEmployee.shelterId = secondShelter.id;
    await secondShelterEmployee.save();
}

async function teardown(
    shelterInfo,
    secondShelterInfo,
    addingPetData,
    petForUpdatingData,
    testPet1Data,
    testPet2Data,
    petForDeletingData,
    defaultUserInfoData,
    userWithoutShelterInfoData,
    petAdminInfoData,
    secondShelterEmployeeData,
    newPetData,
){
    await Shelter.destroy({where: {shelter_name: shelterInfo.shelterName}});
    await Shelter.destroy({where: {shelter_name: secondShelterInfo.shelterName}});
    const addingPet = await Pet.findAll({where: {pet_name: addingPetData.petName}});
    await _deletePetData(addingPet);

    const petForUpdating = await Pet.findAll({where: {pet_name: petForUpdatingData.petName}});
    await _deletePetData(petForUpdating);

    const testPet1 = await Pet.findAll({where: {pet_name: testPet1Data.petName}});
    await _deletePetData(testPet1);

    const testPet2 = await Pet.findAll({where: {pet_name: testPet2Data.petName}});
    await _deletePetData(testPet2);

    const petForDeleting = await Pet.findAll({where: {pet_name: petForDeletingData.petName}});
    await _deletePetData(petForDeleting);

    const newPet = await Pet.findAll({where: {pet_name: newPetData.petName}});
    await _deletePetData(newPet);

    await User.destroy({where: {login: defaultUserInfoData.login}});
    await User.destroy({where: {login: userWithoutShelterInfoData.login}});
    await User.destroy({where: {login: petAdminInfoData.login}});
    await User.destroy({where: {login: secondShelterEmployeeData.login}});
}

module.exports = {setup, teardown};