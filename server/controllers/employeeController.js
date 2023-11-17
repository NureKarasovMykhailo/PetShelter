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
    await Promise.all(roleTitles.map(async roleTitle => {
        let role = await Role.findOne({where: {role_title: roleTitle}});
        await UserRole.create({userId: id, roleId: role.id});
    }));
}

const isSubscriber = async (employee) => {
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
        try {
            const shelterId = req.user.shelterId;
            let { roleTitle, domainEmail, limit, page, sortBy} = req.query;
            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;

            let employeesArr = [];

           if (domainEmail){
               let employee = await User.findOne({where: {shelterId: req.user.shelterId, domain_email: domainEmail}});
               if (employee){
                   employeesArr.push(employee);
               }
           }

           if (roleTitle){
               const role = await Role.findOne({where: {role_title: roleTitle}});
               employeesArr = await User.findAll({
                  where: {shelterId: req.user.shelterId},
                  include: [{
                      model: Role,
                      attributes: [],
                      where: {id: role.id}
                  }]
               });
           }

           if (!roleTitle && !domainEmail){
               employeesArr = await User.findAll({
                   where: {shelterId: req.user.shelterId}
               });
           }

           employeesArr = employeesArr.filter(employee => employee.login !== req.user.login);

           await Promise.all(employeesArr.map(async employee => {
                employee = employee.get();
                employee.role = await getUserRoles(employee);
           }));

            if (sortBy === 'asc') {
                employeesArr.sort((a, b) => a.full_name.localeCompare(b.full_name));
            } else if (sortBy === 'desc') {
                employeesArr.sort((a, b) => b.full_name.localeCompare(a.full_name));
            }

            let employeesCount = employeesArr.length;
            let totalPages = Math.ceil(employeesCount / limit);
            let paginatedEmployees = employeesArr.slice(offset, offset + limit);

            return res.json({
                employees: paginatedEmployees,
                pagination: {
                    totalItems: employeesCount,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            });
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error));
        }
    }

    async getOne(req, res, next) {
        const {id} = req.params;
        const employee = await User.findOne({
            where: {id},
        });
        if (!employee) {
            return next(ApiError.badRequest(`There is not user with id:${id}`));
        }
        if (employee.shelterId !== req.user.shelterId) {
            return next(ApiError.forbidden('You do not have access to information of this shelter'));
        }

        let employeeWithRole = employee.get();
        employeeWithRole.roles = await getUserRoles(employeeWithRole);

        return res.json({employee: employeeWithRole});
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
        if (await isSubscriber(employee)) {
            return next(ApiError.forbidden('You can not delete the owner of the shelter'));
        }
        await employee.destroy();
        return res.json({message: `Employee ${employee.login} was deleted`})
    }

    async addRoles(req, res, next){
        let {roles} = req.body;
        const {id} = req.params;


        const user = await User.findOne({where: {id}});
        if (!user){
            return next(ApiError.badRequest(`There no user with ID: ${id}`));
        }
        if (roles.includes('subscriber')){
            return next(ApiError.badRequest('You can\'t add role subscriber for the user'));
        }

        const existedUserRoles = await getUserRoles(user);
        existedUserRoles.map(existedUserRole => {
           if (roles.includes(existedUserRole)){
               roles.splice(roles.indexOf(existedUserRole), 1);
           }
        });

        await createUserRoles(id, roles);
        return res.status(200).json({message: "Roles was added"});
    }

    async deleteRoles(req, res, next){
        const {roles} = req.body;
        const {id} = req.params;
        const user = await User.findOne({where: {id}});
        if (!user){
            return next(ApiError.badRequest(`There are no user with ID: ${id}`));
        }
        const existedUserRoles = await getUserRoles(user);
        if (existedUserRoles.includes('subscriber')){
            return next(ApiError.forbidden('You can\'t change subscriber account'));
        }
        await Promise.all(roles.map(async roleTitle => {
            if (roleTitle !== 'employee') {
                let role = await Role.findOne({where: {role_title: roleTitle}});
                await UserRole.destroy({where: {userId: id, roleId: role.id}});
            }
        }));
        return res.status(200).json({message: "Roles were successfully deleted"});
    }
}

module.exports = new EmployeeController();