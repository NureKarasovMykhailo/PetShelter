const dbClass = require('../classes/DataBase');
const {DataTypes} = require('sequelize');

const User = dbClass.db.define('user', {
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
    is_paid: {type: DataTypes.BOOLEAN, default: false},
    subscriptionId: {type: DataTypes.STRING}
});

const Role = dbClass.db.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    role_title: {type: DataTypes.STRING, unique: true}
});

const WorkOffer = dbClass.db.define('work_offer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    work_title: {type: DataTypes.STRING},
    work_description: {type: DataTypes.TEXT},
    work_telephone: {type: DataTypes.STRING},
    work_email: {type: DataTypes.STRING},
    publish_date: {type: DataTypes.DATE}
});

const Shelter = dbClass.db.define('shelter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    shelter_name: {type: DataTypes.STRING, unique: true},
    shelter_address: {type: DataTypes.STRING},
    shelter_domain: {type: DataTypes.STRING, unique: true},
    shelter_image: {type: DataTypes.STRING}
});

const Pet = dbClass.db.define('pet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    pet_image: {type: DataTypes.STRING},
    pet_name: {type: DataTypes.STRING},
    pet_age: {type: DataTypes.INTEGER},
    pet_gender: {type: DataTypes.STRING},
    cell_number: {type: DataTypes.STRING},
    pet_kind: {type: DataTypes.STRING}
});

const PetCharacteristic = dbClass.db.define('pet_characteristic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING}
});

const Feeder = dbClass.db.define('feeder', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    capacity: {type: DataTypes.DOUBLE},
    designed_for: {type: DataTypes.STRING},
    feeder_colour: {type: DataTypes.STRING}
});

const FeederInfo = dbClass.db.define('feeder_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount_of_food: {type: DataTypes.DOUBLE},
    feeding_time: {type: DataTypes.DATE}
});

const AdoptionOffer = dbClass.db.define('adoption_offer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    adoption_price: {type: DataTypes.DECIMAL},
    adoption_telephone: {type: DataTypes.STRING},
    adoption_email: {type: DataTypes.STRING},
    adoption_info: {type: DataTypes.TEXT}
});

const ApplicationForAdoption = dbClass.db.define('application_for_adoption', {
   id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   application_address: {type: DataTypes.STRING},
    is_application_approved: {type: DataTypes.BOOLEAN}
});

const UserRole = dbClass.db.define('user_role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const ConfirmationCode = dbClass.db.define('confirmation_code', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING},
    expiresAt: {type: DataTypes.DATE}
});

const Collar = dbClass.db.define('collar', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    max_temperature: {type: DataTypes.DOUBLE},
    min_temperature: {type: DataTypes.DOUBLE},
    min_pulse: {type: DataTypes.DOUBLE},
    max_pulse: {type: DataTypes.DOUBLE}
});

const CollarInfo = dbClass.db.define('collar_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    temperature: {type: DataTypes.DOUBLE},
    pulse: {type: DataTypes.DOUBLE},
    in_safe_radius: {type: DataTypes.BOOLEAN, default: true}
});

Shelter.hasMany(WorkOffer);
WorkOffer.belongsTo(Shelter);

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

Feeder.hasOne(Pet);
Pet.belongsTo(Feeder);

Feeder.hasMany(FeederInfo);
FeederInfo.belongsTo(Feeder);

Pet.hasMany(AdoptionOffer);
AdoptionOffer.belongsTo(Pet);

AdoptionOffer.hasMany(ApplicationForAdoption);
ApplicationForAdoption.belongsTo(AdoptionOffer);

User.hasMany(ApplicationForAdoption);
ApplicationForAdoption.belongsTo(User);

Shelter.hasMany(Feeder);
Feeder.belongsTo(Shelter);

Shelter.hasMany(Collar);
Collar.belongsTo(Shelter);

User.belongsToMany(Role, {through: UserRole});
Role.belongsToMany(User, {through: UserRole});

User.hasMany(ConfirmationCode);
ConfirmationCode.belongsTo(User);

Pet.hasOne(Collar);
Collar.belongsTo(Pet);

Collar.hasOne(Pet);
Pet.belongsTo(Collar);

Collar.hasMany(CollarInfo);
CollarInfo.belongsTo(Collar);

module.exports = {
    User,
    Role,
    WorkAnnouncement: WorkOffer,
    Shelter,
    Pet,
    PetCharacteristic,
    Feeder,
    FeederInfo,
    AdoptionAnnouncement: AdoptionOffer,
    ApplicationForAdoption,
    UserRole,
    ConfirmationCode,
    Collar,
    CollarInfo
};