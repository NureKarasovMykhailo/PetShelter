const {User, Role, UserRole} = require("../models/models");
const {Sequelize} = require("sequelize");
const bcrypt = require("bcrypt");
const getUserRoles = require("../middleware/getUserRoles");
const models = require("../models/models");

class EmployeeService {

    async createEmployee(
        login,
        domainEmail,
        email,
        fullName,
        birthday,
        password,
        shelterId,
        employeeImage
    ){
        return await User.create(
            {
                login: login,
                domain_email: domainEmail,
                email: email,
                full_name: fullName,
                birthday: birthday,
                hashed_password: bcrypt.hashSync(password, 7),
                user_image: employeeImage,
                shelterId: shelterId,
                is_paid: false,
                date_of_registration: Date.now()
            }
        );
    }

    async isEmployeeExist (login, email, domainEmail)  {
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
        return candidate !== null;
    };

    async createEmployeeRole(employeeId, roleTitles){
        if (!Array.isArray(roleTitles)){
            const role = await Role.findOne({where: {role_title: roleTitles}});
            await UserRole.create({userId: employeeId, roleId: role.id});
        } else {
            await Promise.all(roleTitles.map(async roleTitle => {
                const role = await Role.findOne({where: {role_title: roleTitle}});
                await UserRole.create({userId: employeeId, roleId: role.id});
            }));
        }
    }

    async getUserById(id) {
        return await User.findOne({ where: { id } });
    }

    async getEmployeeByDomainEmail(shelterId, domainEmail){
        return await User.findOne({
            where: {
                shelterId,
                domain_email: domainEmail
            }
        });
    }

    async getEmployeesByRole(shelterId, roleTitle){
        const role = await Role.findOne({ where: { role_title: roleTitle } });
        return await User.findAll({
            where: { shelterId },
            include: [{
                model: Role,
                attributes: [],
                where: { id: role.id }
            }]
        });
    }

    async getAllShelterEmployees(shelterId){
        return await User.findAll({ where: { shelterId } });
    }

    async populateEmployeeRoles(employees) {
        await Promise.all(employees.map(async employee => {
            employee = employee.get();
            employee.role = await getUserRoles(employee);
        }));
    }

    sortEmployees(employees, sortBy) {
        if (sortBy === 'asc') {
            employees.sort((a, b) => a.full_name.localeCompare(b.full_name));
        } else if (sortBy === 'desc') {
            employees.sort((a, b) => b.full_name.localeCompare(a.full_name));
        }
    }

    async isSubscriber (employee) {
        const roles = await getUserRoles(employee);
        return roles.includes('subscriber');
    }

    async deleteEmployeeRole(userId, roles) {
        await Promise.all(roles.map(async roleTitle => {
            if (roleTitle !== 'employee') {
                const role = await Role.findOne({ where: { role_title: roleTitle } });
                await UserRole.destroy({ where: { userId, roleId: role.id } });
            }
        }));
    }

    async deleteAllShelterEmployee (shelterId, shelterOwnerId) {
        await models.User.destroy({
            where: {
                shelterId,
                id: {
                    [Sequelize.Op.not]: shelterOwnerId
                }
            },
        });
    }
}

module.exports = new EmployeeService();