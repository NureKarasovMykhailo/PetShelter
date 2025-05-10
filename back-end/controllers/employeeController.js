const {User} = require('../models/models');
const ApiError = require('../error/ApiError');
const {validationResult} = require('express-validator');
const generateRandomPassword = require('../functions/generateRandomPassword');
const nodemailer = require('../classes/Nodemailer');
const getUserRoles = require('../middleware/getUserRoles');
const pagination = require("../classes/Pagination");
const employeeService = require("../services/EmployeeService");
const i18n = require('i18n');

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
                return next(ApiError.conflict(i18n.__('employeeWithSuchDataExist')));
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

            const emailSubject = i18n.__('employeeCreatingHeader');
            const emailText = i18n.__('employeeCreatingInfo') + '\n'
                + i18n.__("employeeCreatingInfoLogin") + createdEmployee.login + '\n'
                + i18n.__('employeeCreatingPassword') + password + '\n'
                + i18n.__("employeeCreatingEmailEnd");


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
            const errorArray = errors.array();
            errorArray.forEach(error => {
                error.msg = i18n.__(error.msg);
            });
            return next(ApiError.badRequest(errorArray));
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
                return next(ApiError.badRequest(i18n.__('noUserFound') + employeeId));
            }

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
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
                return next(ApiError.badRequest(i18n.__('noUserFound') + employeeId));
            }

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            if (await employeeService.isSubscriber(targetEmployee)) {
                return next(ApiError.forbidden(i18n.__("youCannotDeleteOwnerOfTheShelter")));
            }
            await targetEmployee.destroy();
            return res.status(200).json({message: targetEmployee.login + i18n.__('employeeWasDeleted')})
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
            this._checkUserExistence(targetEmployee, i18n.__('noUserFound') + employeeId, next);

            if (targetEmployee.shelterId !== req.user.shelterId) {
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            this._checkInvalidRole(roles, ROLES.SUBSCRIBER, next);

            const existingRoles = await getUserRoles(targetEmployee);
            const rolesToAdd = this._getRolesToAdd(roles, existingRoles);

            await employeeService.createEmployeeRole(employeeId, rolesToAdd);

            return res.status(200).json({ message: i18n.__('roleWasAdded') });
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
                return next(ApiError.forbidden(i18n.__('youDontHaveAccessToThisInformation')));
            }

            this._checkUserExistence(targetEmployee, i18n.__('noUserFound') + employeeId, next);
            this._checkInvalidRole(roles, ROLES.SUBSCRIBER, next);
            this._checkInvalidRole(roles, ROLES.EMPLOYEE, next);

            const existingRoles = await getUserRoles(targetEmployee);

            if (existingRoles.includes(ROLES.SUBSCRIBER)) {
                 return next(ApiError.forbidden(i18n.__('youCannotChangeSubscriberAccount')));
            }

            await employeeService.deleteEmployeeRole(employeeId, roles);

            return res.status(200).json({ message: i18n.__('roleWereDeleted') });
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
            next(ApiError.badRequest(i18n.__('youCantAddRole') + invalidRole));
        }
    }

    _getRolesToAdd(roles, existingRoles) {
        return roles.filter(role => !existingRoles.includes(role));
    }
}

module.exports = new EmployeeController();