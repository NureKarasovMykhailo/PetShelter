const {User, Role, ConfirmationCode} = require('../models/models');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('node:path');
const fs = require('node:fs');
const getUserRole = require('../middleware/getUserRoles');
const generateConfirmationCode = require('../functions/generateConfirmationCode');
const userService = require("../services/UserService");
const generateJwt = require("../functions/generateJwt");
const subscription = require('../classes/Subscription');
const nodemailer = require('../classes/Nodemailer');
const conformationCode = require('../classes/ConformationCode');

class UserController {

    constructor() {
        this.userRegistration = this.userRegistration.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePhoneNumber = this.changePhoneNumber.bind(this);
    }

    async userRegistration(req, res, next) {
        try {
            const {
                login,
                email,
                fullName,
                birthday,
                phoneNumber,
                password
            } = req.body;

            let userImageName;
            let userImage;

            if (!req.files || Object.keys(req.files).length === 0) {
                userImageName = 'default-user-image.jpg';
            } else {
                userImage = req.files.userImage;
                userImageName = uuid.v4() + '.jpg';
            }

            if (await userService.checkUserDuplicates(login, email, phoneNumber)) {
                return next(ApiError.conflict('User with this data already exists'))
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const createdUser = await User.create({
                login: login,
                user_image: userImageName,
                email: email,
                full_name: fullName,
                birthday: birthday,
                phone_number: phoneNumber,
                date_of_registration: Date.now(),
                hashed_password: hashedPassword,
                is_paid: false
            });

            await userService.assignUserRoles(createdUser.id);

            await this._saveUserImage(userImage, userImageName);

            return res.status(200).json({message: 'User successfully created'});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server Error while registration ' + error));
        }
    }

    async _saveUserImage(userImage, userImageName) {
        if (userImageName !== 'default-user-image.jpg') {
            await userImage.mv(path.resolve(__dirname, '..', 'static', userImageName));
        }
    }

    async authorization(req, res, next) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({where: {login: login}});
            if (!user) {
                return next(ApiError.badRequest('Invalid login or password'));
            }
            let comparePassword = bcrypt.compareSync(password, user.hashed_password);
            if (!comparePassword) {
                return next(ApiError.badRequest('Invalid login or password'));

            }
            const roles = await getUserRole(user);
            const token = await generateJwt(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId,
                roles
            );
            return res.status(200).json({token: token});

        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server error while authorization ' + error));
        }
    }

    async check (req, res, next) {
        try {
            const user = req.user;
            const roles = await getUserRole(user)
            const token = await generateJwt(
                user.id,
                user.login,
                user.user_image,
                user.domain_email,
                user.email,
                user.full_name,
                user.birthday,
                user.phone_number,
                user.is_paid,
                user.shelterId,
                roles
            );
            return res.status(200).json({token: token});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Server error while checking auth ' + error));
        }
    }

    async subscribe(req, res, next){
        try {
            const response = await subscription.subscribeRequest();
            if (response.ok) {
                const subscriptionDetails = await response.json();
                const subscriptionId = subscriptionDetails.id;
                await userService.setSubscriberId(req.user.id, subscriptionId);
                res.send(subscriptionDetails);
            }
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while subscribing ' + error));
        }
    }

    async changeEmail(req, res, next){
        try {
            const {newEmail} = req.body;

            const validationEmailError = this._validateEmailFormat(newEmail);
            if (validationEmailError){
                return next(validationEmailError);
            }

            if (await this._checkIfSameEmail(req.user.id, newEmail)) {
                return res.json({ message: 'Email updated successfully' });
            }

            if (await userService.isEmailExist(newEmail)){
                return next(ApiError.badRequest('User with this email already exists'))
            }

            const user = await User.findOne({where: {id: req.user.id}});
            user.email = newEmail;

            const response = await userService.applyUserChanges(user);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while changing email ' + error));
        }
    }

    _validateEmailFormat(newEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return ApiError.badRequest('Please enter a correct email address');
        }
    }
    async _checkIfSameEmail(userId, newEmail) {
        const user = await User.findOne({ where: { id: userId } });
        return user.email === newEmail;
    }

    async changePhoneNumber(req, res, next){
        try {
            const {newPhoneNumber} = req.body;
            const phoneValidationError = this._validatePhoneNumberFormat(newPhoneNumber);
            if (phoneValidationError){
                return next(phoneValidationError);
            }
            if (userService.isNumberExist(newPhoneNumber)){
                return next(ApiError.badRequest('User with this phone number already exists'))
            }
            const user = await User.findOne({where: {id: req.user.id}});
            user.phone_number = newPhoneNumber;
            const response = await userService.applyUserChanges(user);
            return res.status(200).json(response);
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while changing phone number ' + error));
        }
    }

    _validatePhoneNumberFormat(newPhoneNumber) {
        const phoneRegex = /^\+\d{7,15}$/;
        if (!phoneRegex.test(newPhoneNumber)) {
            return ApiError.badRequest('Please enter a correct phone number');
        }
    }

    async sendConfirmationCode(req, res, next){
        try {
            const {email} = req.body;
            const targetUser = await User.findOne({where: {email: email}});
            if (!targetUser){
                return next(ApiError.badRequest(`There no user with email: ${targetUser}`));
            }
            const confirmationCode = generateConfirmationCode();
            const emailSubject = 'Запит на зміну паролю'
            const emailText = `Вітаємо,\n`
                + `Ви отримали це повідомлення, оскільки нам надійшла заявка на сміну пароля для вашого облікового запису.\n`
                + `Код підтвердження для сміни пароля: ${confirmationCode}\n`
                + `Будь ласка, введіть цей код на веб-сайті для завершення процесу сміни пароля.\n`
                + `Цей код дійсний протягом 15 хвилин.\n`
                + `Якщо ви не робили заявку на сміну пароля, проігноруйте це повідомлення. Ваш пароль залишиться незмінним.\n`
                + `Дякуємо за користування нашим сервісом.\n`
                + `З повагою,\n`
                + `Команда підтримки користувачів\n`
                + `PetShelter`;
            await nodemailer.sendEmail(email, emailSubject, emailText);
            await conformationCode.createConformationCode(confirmationCode, targetUser.id);
            return res.status(200).json({message: 'Confirmation code was sent'});
        } catch (error) {
            console.log(error);
            return next(ApiError.internal('Internal server error while sending code ' + error));
        }
    }

    async checkConfirmationCode(req, res, next){
        const {confirmationCode, email} = req.body;
        const candidate = await ConfirmationCode.findOne({where: {code: confirmationCode}});
        const changingPasswordUser = await User.findOne({where: {id: candidate.userId}});
        if (!candidate || changingPasswordUser.email !== email){
            return next(ApiError.badRequest('You entered wrong code'));
        }
        if (candidate.expiresAt < Date.now()){
            await candidate.destroy();
            return next(ApiError.badRequest('This verification code is obsolete'));
        }
        await candidate.destroy();
        return res.status(200).json({message: 'Successful confirmation'})
    }

    async changePassword(req, res, next){
        const {email, newPassword, passwordConfirm} = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(newPassword)){
            return next(ApiError.badRequest('Password must contain at least 8 symbols,' +
                ' 1 upper case symbol and 1 special symbol'));
        }
        if (newPassword !== passwordConfirm){
            return next(ApiError.badRequest('Password not equal to confirm password'))
        }
        const changingPasswordUser = await User.findOne({where: {email}});
        console.log(newPassword);
        changingPasswordUser.hashed_password = bcrypt.hashSync(newPassword, 7);
        await changingPasswordUser.save();
        const newToken = await applyUserChanges(changingPasswordUser);
        return res.status(200).json({token: newToken});
    }

    async changeUserImage(req, res){
        const {newUserImage} = req.files;
        const changingImageUser = await User.findOne({where: {id: req.user.id}});

        if (changingImageUser.user_image !== 'default-user-image.jpg'){
            await fs.promises.unlink(path.resolve(__dirname, '..', 'static', changingImageUser.user_image));
        }

        const newUserImageName = uuid.v4() + '.jpg'
        await newUserImage.mv(path.resolve(__dirname, '..', 'static', newUserImageName));
        changingImageUser.user_image = newUserImageName;
        changingImageUser.save();
        const newToken = await applyUserChanges(changingImageUser);
        return res.status(200).json({newToken});
    }

    async getProfileInfoByToken(req, res){
        const userId = req.user.id;
        const user = await User.findOne({
            where: {id: userId},
            attributes: {exclude: ['hashed_password']},
            include: {model: Role}
        });
        return res.status(200).json(user);
    }

    async getProfileInfoByUserId(req, res, next){
        const {userId} = req.params;
        const user = await User.findOne({
           where: {id: userId},
           attributes: {exclude: ['hashed_password']},
           include: {model: Role}
        });
        if (!user){
            return next(ApiError.notFound(`There are no user with ID: ${userId}`));
        }
        return res.status(200).json(user);
    }

    async getUsers(req, res, next){
        let {
            limit,
            page,
            login
        } = req.query;

        if (login){
            const user = await User.findOne({
                where: {login},
                attributes: {exclude: ['hashed_password']},
                include: {model: Role}
            });
            return res.status(200).json(user);
        } else if (!login) {
            limit = limit || 9;
            page = page || 1;
            let offset = page * limit - limit;
            const users = await User.findAll({
                attributes: {exclude: ['hashed_password']},
                include: {model: Role}
            });
            const usersCount = users.length;
            let totalPages = Math.ceil(usersCount / limit);
            let paginatedUsers = users.slice(offset, offset + limit);

            return res.status(200).json({
                users: paginatedUsers,
                pagination: {
                    totalItems: usersCount,
                    totalPages: totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                }
            });
        }
        return next(ApiError.internal('Internal server error while getting users'));

    }

    async deleteUser(req, res, next){
        const {userId} = req.params;

        if (userId === req.user.id){
            return next(ApiError.badRequest('You can\'t delete yourself'));
        }

        const user = await User.findOne({
           where: {id: userId}
        });
        if (!user){
            return next(ApiError.notFound(`There no user with ID: ${userId}`));
        }
        const deletedUserRoles = await getUserRole(user);
        if (deletedUserRoles.includes('systemAdmin')){
            return next(ApiError.forbidden('You can\'t delete other system administrator'));
        }
        if (deletedUserRoles.includes('subscriber') && user.shelters !== null){
            const deleteShelterResponse = await deleteShelter(user.id);
            if (deleteShelterResponse instanceof ApiError){
                return next(deleteShelterResponse);
            }
        }
        await user.destroy();
        return res.status(200).json({message: `User with ID: ${userId} was deleted`});
    }

    async deleteUserByToken(req, res, next){
        const user = await User.findOne({
            where: {id: req.user.id}
        });
        const deletedUserRoles = await getUserRole(user);
        if (deletedUserRoles.includes('subscriber') && user.shelters !== null){
            const deleteShelterResponse = await deleteShelter(user.id);
            if (deleteShelterResponse instanceof ApiError){
                return next(deleteShelterResponse);
            }
        }
        await user.destroy();
        return res.status(200).json({message: `User with ID: ${user.id} was deleted`});
    }

}

module.exports = new UserController();