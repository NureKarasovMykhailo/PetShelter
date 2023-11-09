const {User, UserRole, Shelter, Role} = require('../../models/models');

async function setup(
    shelterInfo,
    defaultUserInfo,
    subscriberWithOutShelterInfo,
    workerAdminUserInfo,
    existedEmployeeInfo,
    secondShelterInfo,
    employeeOfSecondShelterInfo
){
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
    const subscriberWithOutShelter = await User.create({
        login: subscriberWithOutShelterInfo.login,
        user_image: subscriberWithOutShelterInfo.userImage,
        domain_email: subscriberWithOutShelterInfo.domainEmail,
        email: subscriberWithOutShelterInfo.email,
        full_name: subscriberWithOutShelterInfo.full_name,
        birthday: subscriberWithOutShelterInfo.birthday,
        phone_number: subscriberWithOutShelterInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: subscriberWithOutShelterInfo.hashedPassword,
        is_paid: subscriberWithOutShelterInfo.isPaid
    });
    const workerAdminUser =  await User.create({
        login: workerAdminUserInfo.login,
        user_image: workerAdminUserInfo.userImage,
        domain_email: workerAdminUserInfo.domainEmail,
        email: workerAdminUserInfo.email,
        full_name: workerAdminUserInfo.full_name,
        birthday: workerAdminUserInfo.birthday,
        phone_number: workerAdminUserInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: workerAdminUserInfo.hashedPassword,
        is_paid: workerAdminUserInfo.isPaid
    });
    const existedEmployee = await User.create({
        login: existedEmployeeInfo.login,
        user_image: existedEmployeeInfo.userImage,
        domain_email: existedEmployeeInfo.domainEmail,
        email: existedEmployeeInfo.email,
        full_name: existedEmployeeInfo.full_name,
        birthday: existedEmployeeInfo.birthday,
        phone_number: existedEmployeeInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: existedEmployeeInfo.hashedPassword,
        is_paid: existedEmployeeInfo.isPaid
    });
    const employeeOfSecondShelter = await User.create({
        login: employeeOfSecondShelterInfo.login,
        user_image: employeeOfSecondShelterInfo.userImage,
        domain_email: employeeOfSecondShelterInfo.domainEmail,
        email: employeeOfSecondShelterInfo.email,
        full_name: employeeOfSecondShelterInfo.full_name,
        birthday: employeeOfSecondShelterInfo.birthday,
        phone_number: employeeOfSecondShelterInfo.phone_number,
        date_of_registration: Date.now(),
        hashed_password: employeeOfSecondShelterInfo.hashedPassword,
        is_paid: employeeOfSecondShelterInfo.isPaid
    });
    const userRole = await Role.findOne({where: {role_title: 'user'}});
    const workerAdminRole = await Role.findOne({where: {role_title: 'workerAdmin'}});
    const subscriber = await Role.findOne({where: {role_title: 'subscriber'}});

    await UserRole.create({userId: defaultUser.id, roleId: userRole.id});
    await UserRole.create({userId: subscriberWithOutShelter.id, roleId: subscriber.id});
    await UserRole.create({userId: workerAdminUser.id, roleId: workerAdminRole.id});
    await UserRole.create({userId: existedEmployee.id, roleId: subscriber.id});
    await UserRole.create({userId: existedEmployee.id, roleId: userRole.id});
    await UserRole.create({userId: employeeOfSecondShelter.id, roleId: workerAdminRole.id});

    defaultUser.shelterId = shelter.id;
    workerAdminUser.shelterId = shelter.id;
    existedEmployee.shelterId = shelter.id;
    employeeOfSecondShelter.shelterId = secondShelter.id;

    await defaultUser.save();
    await workerAdminUser.save();
    await existedEmployee.save();
    await employeeOfSecondShelter.save();
}

async function teardown(
    shelterInfo,
    defaultUserInfo,
    subscriberWithOutShelterInfo,
    workerAdminUserInfo,
    existedEmployeeInfo,
    addedEmployeeInfo,
    secondShelterInfo,
    employeeOfSecondShelterInfo
) {
    await Shelter.destroy({where: {shelter_name: shelterInfo.shelterName}});
    await Shelter.destroy({where: {shelter_name: secondShelterInfo.shelterName}});
    await User.destroy({where: {login: defaultUserInfo.login}});
    await User.destroy({where: {login: employeeOfSecondShelterInfo.login}});
    await User.destroy({where: {login: subscriberWithOutShelterInfo.login}});
    await User.destroy({where: {login: workerAdminUserInfo.login}});
    await User.destroy({where: {login: existedEmployeeInfo.login}});
    await User.destroy({where: {login: addedEmployeeInfo.login}});
}

module.exports = {setup, teardown};