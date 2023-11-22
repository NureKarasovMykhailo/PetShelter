const {User} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const generateRandomPassword = require('../functions/generateRandomPassword');
const nodemailer = require('../classes/Nodemailer');
const getUserRoles = require('../middleware/getUserRoles');
const pagination = require("../classes/Pagination");
const employeeService = require("../services/EmployeeService");

const DEFAULT_USER_IMAGE_NAME = 'default-user-image.jpg';

const ROLES = {
    EMPLOYEE: 'employee',
    SUBSCRIBER: 'subscriber'
};

class EmployeeController {

    constructor() {
        this._validateEmployeeCreationRequest = this._validateEmployeeCreationRequest.bind(this);
        this.createEmployee = this.createEmployee.bind(this);
        this._filterOutCurrentUser = this._filterOutCurrentUser.bind(this);
        this.getAllEmployees = this.getAllEmployees.bind(this);
        this.getOneEmployee = this.getOneEmployee.bind(this);
        this._addRolesToEmployee = this._addRolesToEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.addRoles = this.addRoles.bind(this);
        this.deleteRoles = this.deleteRoles.bind(this);
        this._checkUserExistence  = this._checkUserExistence.bind(this);
        this._getRolesToAdd = this._getRolesToAdd.bind(this);
        this._checkInvalidRole = this._checkInvalidRole.bind(this);
    }

    async createEmployee(req, res, next) {
        try {
            let {
                login,
                domainEmail,
                email,
                fullName,
                birthday,
            } = req.body;

            if (await employeeService.isEmployeeExist(login, email, domainEmail)){
                return next(ApiError.conflict('Employee with such data already exist'));
            }


            await this._validateEmployeeCreationRequest(req, next);

            const password = generateRandomPassword(8);

            const createdEmployee = await employeeService.createEmployee(
                login,
                domainEmail,
                email,
                fullName,
                birthday,
                password,
                req.user.shelterId,
                DEFAULT_USER_IMAGE_NAME
            );

            await employeeService.createEmployeeRole(createdEmployee.id, ROLES.EMPLOYEE);

            const emailSubject = 'Інформація про аккаунт';
            const emailText = `На даний адрес email був зареєстрований новий аккаунт у додатку PetShelter.\n`
                + `Логін: ${createdEmployee.login}\n`
                + `Пароль: ${password}\n`
                + `Після входу у застосунок змініть пароль, та нікому його не кажіть`;


            await nodemailer.sendEmail(createdEmployee.email, emailSubject, emailText);

            return res.status(200).json(createdEmployee);
        } catch (error){
            console.log(error);
            return next(ApiError.internal(error));
        }
    }

    async _validateEmployeeCreationRequest (req, next)  {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.badRequest(errors));
        }
    }


    async getAllEmployees(req, res, next) {
        try {
            let {
                roleTitle,
                domainEmail,
                limit,
                page,
                sortBy
            } = req.query;
            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;

            let employees = [];

            if (domainEmail){
                let employee = await employeeService.getEmployeeByDomainEmail(req.user.shelterId, domainEmail);
                if (employee){
                    employees.push(employee);
                }
            }

            if (roleTitle){
                employees = await employeeService.getEmployeesByRole(req.user.shelterId, roleTitle);
            }

            if (!roleTitle && !domainEmail){
                employees = await employeeService.getAllShelterEmployees(req.user.shelterId);
            }

            employees = this._filterOutCurrentUser(employees, req.user.id)

            await employeeService.populateEmployeeRoles(employees);

            employeeService.sortEmployees(employees, sortBy);

            const paginatedEmployees = pagination.paginateItems(employees, offset, limit);

            return res.status(200).json({
                employees: paginatedEmployees.paginatedItems,
                pagination: {
                    totalItems: paginatedEmployees.itemCount,
                    totalPages: paginatedEmployees.totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            });
        } catch (error) {
            console.log(error)
            return next(ApiError.internal(error));
        }
    }
    _filterOutCurrentUser(employees, currentUserId) {
        return employees.filter(employee => employee.id !== currentUserId);
    }

    async getOneEmployee(req, res, next) {
        try {
            const {employeeId} = req.params;
            const targetEmployee = await User.findOne({
                where: { id: employeeId },
            });
            if (!targetEmployee) {
                return next(ApiError.badRequest(`No user found with id: ${employeeId}`));
            }

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            const userWithRoles = await this._addRolesToEmployee(targetEmployee);

            return res.status(200).json(userWithRoles);
        } catch (error){
            console.log(error);
            return next(ApiError.internal(error));
        }
    }

    async _addRolesToEmployee(user){
        const userWithRoles = user.get();
        userWithRoles.roles = await getUserRoles(userWithRoles);
        return userWithRoles;
    }

    async deleteEmployee(req, res, next) {
        try{
            const {employeeId} = req.params;
            const targetEmployee = await User.findOne({where: {id: employeeId}});

            if (!targetEmployee) {
                return next(ApiError.badRequest(`There is not user with id:${employeeId}`));
            }

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            if (await employeeService.isSubscriber(targetEmployee)) {
                return next(ApiError.forbidden('You can not delete the owner of the shelter'));
            }
            await targetEmployee.destroy();
            return res.status(200).json({message: `Employee ${targetEmployee.login} was deleted`})
        } catch (error){
            console.log(error);
            return next(ApiError.internal(error));
        }
    }

    async addRoles(req, res, next) {
        try {
            const { roles } = req.body;
            const { employeeId } = req.params;

            const targetEmployee = await employeeService.getUserById(employeeId);
            this._checkUserExistence(targetEmployee, `There is no user with ID: ${employeeId}`, next);

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            this._checkInvalidRole(roles, ROLES.SUBSCRIBER, next);

            const existingRoles = await getUserRoles(targetEmployee);
            const rolesToAdd = this._getRolesToAdd(roles, existingRoles);

            await employeeService.createEmployeeRole(employeeId, rolesToAdd);

            return res.status(200).json({ message: 'Roles were added' });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal(error));
        }
    }


    async deleteRoles(req, res, next) {
        try {
            const { roles } = req.body;
            const { employeeId } = req.params;

            const targetEmployee = await employeeService.getUserById(employeeId);

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden('You do not have access to information of this shelter'));
            }

            this._checkUserExistence(targetEmployee, `There is no user with ID: ${employeeId}`, next);
            this._checkInvalidRole(roles, ROLES.SUBSCRIBER, next);
            this._checkInvalidRole(roles, ROLES.EMPLOYEE, next);

            const existingRoles = await getUserRoles(targetEmployee);

            if (existingRoles.includes(ROLES.SUBSCRIBER)) {
                 return next(ApiError.forbidden('You can\'t change subscriber account'));
            }

            await employeeService.deleteEmployeeRole(employeeId, roles);

            return res.status(200).json({ message: 'Roles were successfully deleted' });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal(error));
        }
    }
    _checkUserExistence(user, errorMessage, next) {
        if (!user) {
            return next(ApiError.badRequest(errorMessage));
        }
    }

    _checkInvalidRole(roles, invalidRole, next) {
        if (roles.includes(invalidRole)) {
            next(ApiError.badRequest(`You can't add role ${invalidRole} for the user`));
        }
    }

    _getRolesToAdd(roles, existingRoles) {
        return roles.filter(role => !existingRoles.includes(role));
    }
}

module.exports = new EmployeeController();