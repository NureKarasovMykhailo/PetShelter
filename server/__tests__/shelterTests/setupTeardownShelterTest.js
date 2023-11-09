const {User, Shelter, UserRole, Role} = require('../../models/models');

async function setup(
    notSubscriber,
    subscriberWithShelter,
    subscriberWithOutShelter,
    existedShelterData,
    subscriberForUpdating,
    shelterForUpdatingInfo
){
    const notSubscriberUser = await User.create(
        {
            login: notSubscriber.login,
            user_image: notSubscriber.user_image,
            domain_email: notSubscriber.domain_email,
            full_name: notSubscriber.full_name,
            birthday: notSubscriber.birthday,
            phone_number: notSubscriber.phone_number,
            hashed_password: notSubscriber.hashed_password,
            date_of_registration: notSubscriber.date_of_registration,
            is_paid: notSubscriber.is_paid
        }
    );
    const subscriberWithShelterUser = await User.create(
        {
            login: subscriberWithShelter.login,
            user_image: subscriberWithShelter.user_image,
            domain_email: subscriberWithShelter.domain_email,
            full_name: subscriberWithShelter.full_name,
            birthday: subscriberWithShelter.birthday,
            phone_number: subscriberWithShelter.phone_number,
            hashed_password: subscriberWithShelter.hashed_password,
            date_of_registration: subscriberWithShelter.date_of_registration,
            is_paid: subscriberWithShelter.is_paid
        }
    );

    const subscriberWithOutShelterUser = await User.create(
        {
            login: subscriberWithOutShelter.login,
            user_image: subscriberWithOutShelter.user_image,
            domain_email: subscriberWithOutShelter.domain_email,
            full_name: subscriberWithOutShelter.full_name,
            birthday: subscriberWithOutShelter.birthday,
            phone_number: subscriberWithOutShelter.phone_number,
            hashed_password: subscriberWithOutShelter.hashed_password,
            date_of_registration: subscriberWithOutShelter.date_of_registration,
            is_paid: subscriberWithOutShelter.is_paid
        }
    );

    const subscriberForUpdatingUser = await User.create(
        {
            login: subscriberForUpdating.login,
            user_image: subscriberForUpdating.user_image,
            domain_email: subscriberForUpdating.domain_email,
            full_name: subscriberForUpdating.full_name,
            birthday: subscriberForUpdating.birthday,
            phone_number: subscriberForUpdating.phone_number,
            hashed_password: subscriberForUpdating.hashed_password,
            date_of_registration: subscriberForUpdating.date_of_registration,
            is_paid: subscriberForUpdating.is_paid
        }
    );
    const subscriberRole = await Role.findOne({where: {role_title: 'subscriber'}});
    await UserRole.create({userId: subscriberWithOutShelterUser.id, roleId: subscriberRole.id});
    await UserRole.create({userId: subscriberWithShelterUser.id, roleId: subscriberRole.id});
    await UserRole.create({userId: subscriberForUpdatingUser.id, roleId: subscriberRole.id});

    const existedShelter = await Shelter.create(
        {
            shelter_name: existedShelterData.shelterName,
            shelter_address: existedShelterData.shelterCity,
            shelter_domain: existedShelterData.shelterDomain,
            shelter_image: existedShelterData.shelterImage
        }
    );

    const shelterForUpdating = await Shelter.create(
        {
            shelter_name: shelterForUpdatingInfo.shelterName,
            shelter_address: shelterForUpdatingInfo.shelterCity,
            shelter_domain: shelterForUpdatingInfo.shelterDomain,
            shelter_image: shelterForUpdatingInfo.shelterImage
        }
    );
    existedShelter.userId = subscriberWithShelterUser.id;
    subscriberWithShelterUser.shelterId = existedShelter.id;

    shelterForUpdating.userId = subscriberForUpdatingUser.id;
    subscriberForUpdatingUser.shelterId = shelterForUpdating.id;

    await existedShelter.save();
    await subscriberWithShelterUser.save();

    await shelterForUpdating.save();
    await subscriberForUpdatingUser.save();
}

async function teardown(
    notSubscriber,
    subscriberWithShelter,
    subscriberWithOutShelter,
    existedShelterData,
    addedShelter,
    updatedShelter,
    subscriberForUpdating,
    shelterForUpdatingInfo

){
    await User.destroy({where: {login: notSubscriber.login}});
    await User.destroy({where: {login: subscriberWithShelter.login}});
    await User.destroy({where: {login: subscriberWithOutShelter.login}});
    await User.destroy({where: {login: subscriberForUpdating.login}});
    await Shelter.destroy({where: {shelter_name: existedShelterData.shelterName}});
    await Shelter.destroy({where: {shelter_name: addedShelter.shelterName}});
    await Shelter.destroy({where: {shelter_name: updatedShelter.shelterName}});
    await Shelter.destroy({where: {shelter_name: shelterForUpdatingInfo.shelterName}});
}

module.exports = {setup, teardown};