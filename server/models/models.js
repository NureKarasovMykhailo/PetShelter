const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    user_image: {type: DataTypes.STRING},
    domain_email: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, unique: true},
    full_name: {type: DataTypes.STRING},
    birthday: {type: DataTypes.DATE},
    phone_number: {type: DataTypes.STRING, unique: true},
    date_of_registration: {type: DataTypes.DATE},
    hashed_password: {type: DataTypes.STRING},
    is_paid: {type: DataTypes.BOOLEAN, default: false}
});

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role_title: {type: DataTypes.STRING, unique: true}
});

const WorkAnnouncement = sequelize.define('work_announcement', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    work_title: {type: DataTypes.STRING},
    work_description: {type: DataTypes.TEXT},
    work_telephone: {type: DataTypes.STRING},
    work_email: {type: DataTypes.STRING},
    publish_date: {type: DataTypes.DATE}
});

const Shelter = sequelize.define('shelter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    shelter_name: {type: DataTypes.STRING, unique: true},
    shelter_address: {type: DataTypes.STRING},
    shelter_domain: {type: DataTypes.STRING, unique: true},
    shelter_image: {type: DataTypes.STRING}
});

const Pet = sequelize.define('pet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    pet_image: {type: DataTypes.STRING},
    pet_name: {type: DataTypes.STRING},
    pet_age: {type: DataTypes.INTEGER},
    pet_gender: {type: DataTypes.STRING},
    cell_number: {type: DataTypes.STRING}
});

const PetCharacteristic = sequelize.define('pet_characteristic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING}
});

const Feeder = sequelize.define('feeder', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    capacity: {type: DataTypes.DOUBLE},
    designed_for: {type: DataTypes.STRING},
    feeder_colour: {type: DataTypes.STRING}
});

const FeederInfo = sequelize.define('feeder_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount_of_food: {type: DataTypes.DOUBLE},
    feeding_time: {type: DataTypes.DATE}
});

const AdoptionAnnouncement = sequelize.define('adoption_announcement', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    adoption_price: {type: DataTypes.DECIMAL},
    adoption_telephone: {type: DataTypes.STRING},
    adoption_email: {type: DataTypes.STRING},
    adoption_info: {type: DataTypes.TEXT}
});

const ApplicationForAdoption = sequelize.define('application_for_adoption', {
   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   application_name: {type: DataTypes.STRING},
   application_address: {type: DataTypes.STRING},
   application_email: {type: DataTypes.STRING},
   application_telephone: {type: DataTypes.STRING}
});

const UserRole = sequelize.define('user_role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

Shelter.hasMany(WorkAnnouncement);
WorkAnnouncement.belongsTo(Shelter);

Shelter.hasMany(User);
User.belongsTo(Shelter);

User.hasOne(Shelter);
Shelter.belongsTo(User);

Shelter.hasMany(Pet);
Pet.belongsTo(Shelter);

Pet.hasMany(PetCharacteristic);
PetCharacteristic.belongsTo(Pet);

Pet.hasOne(Feeder);
Feeder.belongsTo(Pet);

Feeder.hasMany(FeederInfo);
FeederInfo.belongsTo(Feeder);

Pet.hasMany(AdoptionAnnouncement);
AdoptionAnnouncement.belongsTo(Pet);

AdoptionAnnouncement.hasMany(ApplicationForAdoption);
ApplicationForAdoption.belongsTo(AdoptionAnnouncement)

User.belongsToMany(Role, {through: UserRole});
Role.belongsToMany(User, {through: UserRole})

module.exports = {
    User,
    Role,
    WorkAnnouncement,
    Shelter,
    Pet,
    PetCharacteristic,
    Feeder,
    FeederInfo,
    AdoptionAnnouncement,
    ApplicationForAdoption,
    UserRole
};