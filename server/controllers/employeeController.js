const {User, Role, UserRole, Shelter} = require('../models/models');
const {Sequelize} = require("sequelize");
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const generateRandomPassword = require('../functions/generateRandomPassword');
const bcrypt = require('bcrypt');
const transporter = require('../nodemailerConfig');
const getUserRoles = require('../middleware/getUserRoles');

const isEmployeeWithSuchDataDoesntExist = async (login, email, domainEmail) => {
    const candidate = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    {login: login},
                    {email: email},
                    {domain_email: domainEmail}
                ]
            }
        }
    );
    return !candidate;
};
const createUserRoles = async (id, roleTitles) => {
    roleTitles = JSON.parse(roleTitles);
    await Promise.all(roleTitles.map(async roleTitle => {
        let role = await Role.findOne({where: {role_title: roleTitle}});
        await UserRole.create({userId: id, roleId: role.id});
    }));
}

const isDeletingUserSubscriber = async (employee) => {
    const roles = await getUserRoles(employee);
    return roles.includes('subscriber');
}


const defaultUserImageName = 'default-user-image.jpg';

class EmployeeController {
    async create(req, res, next) {
        const {
            login,
            domainEmail,
            email,
            fullName,
            birthday,
            roles
        } = req.body;
        roles.push("employee");
        if (!await isEmployeeWithSuchDataDoesntExist(login, email, domainEmail)){
            return next(ApiError.badRequest('User with such data already exist'));
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }
        const password = generateRandomPassword(8);
        const user = await User.create(
            {
                login: login,
                domain_email: domainEmail,
                email: email,
                full_name: fullName,
                birthday: birthday,
                hashed_password: bcrypt.hashSync(password, 7),
                user_image: defaultUserImageName,
                shelterId: req.user.shelterId,
                is_paid: false,
                date_of_registration: Date.now()
            }
        );
        await createUserRoles(user.id, roles);

        const mailOptions = {
            from: 'petshelter04@ukr.net',
            to: `${email}`,
            subject: 'Інформація про аккаунт',
            text: `На даний адрес email був зареєстрований новий аккаунт у додатку PetShelter.\n Логін: ${login}\nПароль: ${password}\nПісля входу у застосунок змініть пароль, та нікому його не кажіть`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error while sending email: ' + error);
                return next(ApiError.internal('Error while sending email'))
            }
        });

        return res.json(user);
    }

    async getAll(req, res, next) {
        const shelterId = req.user.shelterId;
        const employees = await User.findAll({where: {shelterId}})
        return res.json(
            {employees: employees.filter(employee => employee.login !== req.user.login)}
        );
    }

    async getOne(req, res, next) {
        const {id} = req.params;
        const employee = await User.findOne({where: {id}});
        if (!employee) {
            return next(ApiError.badRequest(`There is not user with id:${id}`));
        }
        if (employee.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You do not have access to information of this shelter'));
        }
        return res.json(employee);
    }

    async delete(req, res, next) {
        const {id} = req.params;
        const employee = await User.findOne({where: {id}});

        if (!employee) {
            return next(ApiError.badRequest(`There is not user with id:${id}`));
        }
        if (employee.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You do not have access to information of this shelter'));
        }
        if (await isDeletingUserSubscriber(employee)) {
            return next(ApiError.forbidden('You can not delete the owner of the shelter'));
        }
        await employee.destroy();
        return res.json({message: `Employee ${employee.login} was deleted`})
    }
}

module.exports = new EmployeeController();