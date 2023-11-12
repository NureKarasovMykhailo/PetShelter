const {User, Role, UserRole, ConfirmationCode} = require('../models/models');
const {Sequelize} = require("sequelize");
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const getUserRole = require('../middleware/getUserRoles');
const generateConfirmationCode = require('../functions/generateConfirmationCode');
const transporter = require("../nodemailerConfig");


const generateJwt = async (id, login, image, domainEmail, email, fullName,
                           birthday, phoneNumber, isPaid, shelterId, roles) => {
    try {
        return jwt.sign(
            {
                id: id,
                login: login,
                user_image: image,
                domain_email: domainEmail,
                email: email,
                full_name: fullName,
                birthday: birthday,
                phone_number: phoneNumber,
                is_paid: isPaid,
                shelterId: shelterId,
                roles: roles
            },
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        );
    } catch (e) {
        return ApiError.internal('Server error while generating JWT token');
    }
}

const auth = Buffer.from(process.env.CLIENT_ID + ':' + process.env.SECRET).toString('base64');


const setSubscriptionPayload = (subscriptionPlanId) => {
    const subscriptionPayload = {
        "plan_id": subscriptionPlanId,
        "application_context": {
            "brand_name": "Subscription Plan",
            "locale": "en-US",
            "user_action": "SUBSCRIBE_NOW",
            "payment_method": {
                "payer_selected": "PAYPAL",
                "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
            },
            "return_url": "http://localhost:7000/api/user/subscribe/succeed",
            "cancel_url": "http://localhost:7000/subscription/payPalCancelPayment"
        }
    }
    return subscriptionPayload;
}

const setSubscriberId = async (userId, subscriptionId) => {
    const user = await User.findOne({where: {id: userId}});
    user.subscriptionId = subscriptionId;
    await user.save();
}

const applyUserChanges = async (user) => {
    await user.save();
    const roles = await getUserRole(user);
    const newToken = await generateJwt(
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
    return {user: user, token: newToken};
}

class UserController {
    async userRegistration(req, res, next) {
        try {
            const {login, email, fullName,
                birthday, phoneNumber, password} = req.body;
            let userImageName;
            let userImage;
            if (!req.files || Object.keys(req.files).length === 0) {
                userImageName = 'default-user-image.jpg';
            } else {
                userImage = req.files.userImage;
                userImageName = uuid.v4() + '.jpg';
            }
            const candidates = await User.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        {login: login},
                        {email: email},
                        {phone_number: phoneNumber}
                    ]
                }
            });
            if (candidates){
                return next(ApiError.badRequest('User with this data already exists'));
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.badRequest(errors));
            }

            const hashedPassword = bcrypt.hashSync(password, 7);
            const user = await User.create({
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
            const role = await Role.findOne({
                where: {
                    role_title: 'user'
                }
            })

            await UserRole.create({
                userId: user.id,
                roleId: role.id
            });
            if (userImageName !== 'default-user-imag.jpg') {
                await userImage.mv(path.resolve(__dirname, '..', 'static', userImageName));
            }
            return res.status(200).json({message: 'User successfully created'});
        } catch (e) {
            console.log(e);
            return next(ApiError.internal('Server Error while registration'));
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
            return res.json({token});

        } catch (e) {
            return next(ApiError.internal('Server error while authorization'));
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
            return res.json({token});
        } catch (e) {
            return next(ApiError.internal('Server error'));
        }
    }

    async subscribe(req, res){
        const subscriptionPlanId = 'P-2C7336821T225793KMVHJYMQ';
        const response = await fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
            method: 'post',
            body: JSON.stringify(setSubscriptionPayload(subscriptionPlanId)),
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const subscriptionDetails = await response.json();
            const subscriptionId = subscriptionDetails.id;

            await setSubscriberId(req.user.id, subscriptionId);

            res.send(subscriptionDetails);
        }

    }

    async changeEmail(req, res, next){
        const {newEmail} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)){
            return next(ApiError.badRequest('Please enter correct email address'));
        }
        const candidate = await User.findOne({where: {email: newEmail}});

        if (candidate){
            return next(ApiError.badRequest('User with this email already exists'))
        }

        const user = await User.findOne({where: {id: req.user.id}});
        user.email = newEmail;

        const response = await applyUserChanges(user);

        return res.json(response);
    }

    async changePhoneNumber(req, res, next){
        const {newPhoneNumber} = req.body;
        const phoneRegex = /^\+\d{7,15}$/;
        if (!phoneRegex.test(newPhoneNumber)){
            return next(ApiError.badRequest('Please enter correct phone number'));
        }
        const candidate = await User.findOne({where: {phone_number: newPhoneNumber}})
        if (candidate){
            return next(ApiError.badRequest('User with this phone number already exists'))
        }

        const user = await User.findOne({where: {id: req.user.id}});

        user.phone_number = newPhoneNumber;

        const response = await applyUserChanges(user);

        return res.json(response);
    }

    async sendConfirmationCode(req, res, next){
        const {email} = req.body;
        const candidate = await User.findOne({where: {email: email}});
        if (!candidate){
            return next(ApiError.badRequest(`There no user with email: ${candidate}`));
        }
        const confirmationCode = generateConfirmationCode();
        const mailOptions = {
            from: 'petshelter04@ukr.net',
            to: `${email}`,
            subject: 'Запит на зміну паролю',
            text: `Вітаємо,
Ви отримали це повідомлення, оскільки нам надійшла заявка на сміну пароля для вашого облікового запису.
Код підтвердження для сміни пароля: ${confirmationCode}
Будь ласка, введіть цей код на веб-сайті для завершення процесу сміни пароля.
Цей код дійсний протягом 15 хвилин.
Якщо ви не робили заявку на сміну пароля, проігноруйте це повідомлення. Ваш пароль залишиться незмінним.
Дякуємо за користування нашим сервісом.
З повагою,
Команда підтримки користувачів
PetShelter`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error while sending email: ' + error);
                return next(ApiError.internal('Error while sending email'))
            }
        });
        const expirationTime = 15 * 60 * 1000;
        const expiresAt = new Date(Date.now() + expirationTime);

        await ConfirmationCode.create({code: confirmationCode, expiresAt, userId: candidate.id});
        return res.status(200).json({message: 'Confirmation code was sent'});
    }

    async checkConfirmationCode(req, res, next){
        const {confirmationCode, email} = req.body;
        const candidate = await ConfirmationCode.findOne({where: {code: confirmationCode}});
        const changingPasswordUser = await User.findOne({where: {id: candidate.userId}});
        if (!candidate || changingPasswordUser.email != email){
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

    async changeUserImage(req, res, next){
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

}

module.exports = new UserController();